from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langchain_core.tools import tool, StructuredTool
import operator
import json
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage
from ChatBot.prompts import prompt
from InfluxDB import InfluxDB

@tool
def get_avg_temperature(patient_id: int, days: int)-> float:
    """
    Returns average temperature for input patient_id and days.
    e.g. get_avg_temperature: 20001, 2
    Returns average temperature for patient_id 20001 for 2 days.
    """
    token = "=="
    org = "WeCare"
    host = "https://us-east-1-1.aws.cloud2.influxdata.com"
    database="VitalSigns"
    idb = InfluxDB(host=host, token=token, org=org, database=database)

    df, _ = idb.find_avg_vital_signs_by_patient_id_for_today(patient_id, "Temperature")
    if df is None:
        return None
    return df["average"].mean()


@tool
def patient_details(patient_id: str)-> str:
    """
    Returns Patient Details for input patient_id.
    e.g. patient_details: 20001
    Returns Patient Details for patient_id 20001.
    """
    info = {
        "name": "John Doe",
        "age": "3",
        "address": "New vihar, shajapur, mp, India"
    }
    
    return json.dumps(info)



class AgentState(TypedDict): ## Agent's current state, it can be history of messsages and other attributes you want to maintain
    messages: Annotated[list[AnyMessage], operator.add]   ## {'messages': []}
        
class ReActAgent:
    
    def __init__(self, api_key, model_name, db):
        tools = [
            patient_details,
            get_avg_temperature
        ]
        self.init_system()
        self.init_tools(tools)
        self.init_model(api_key, model_name, tools)

        self.db = db
        
        graph = StateGraph(AgentState)  ## Current Agent State will be available at each node of Graph.
        graph.add_node("llama3", self.call_llm)
        graph.add_node("action", self.take_action)
        graph.add_conditional_edges(
            "llama3",
            self.exists_action,
            {True: "action", False: END}
        )
        graph.add_edge("action", "llama3")
        graph.set_entry_point("llama3")
        self.graph = graph.compile()

    def init_system(self):
        self.system = prompt
    
    def init_tools(self, tools):
        self.tools = {t.name: t for t in tools}

    def init_model(self, api_key, model_name, tools):
        llm = ChatGroq(
            model=model_name,
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            api_key=api_key
        )
        self.model = llm.bind_tools(tools, tool_choice="auto")


    def exists_action(self, state: AgentState):
        result = state['messages'][-1]
        return len(result.tool_calls) > 0

    def call_llm(self, state: AgentState):
        messages = state['messages']
        if self.system:
            messages = [SystemMessage(content=self.system)] + messages
        message = self.model.invoke(messages)
        return {'messages': [message]} ## AIMessage

    def take_action(self, state: AgentState):
        tool_calls = state['messages'][-1].tool_calls
        results = []
        for t in tool_calls:
            print(f"Calling Tool: {t}")
            if not t['name'] in self.tools:  # check for bad tool name from LLM
                print(f"\n Tool: {t} does not exist.")
                result = "Incorrect Tool Name, Please Retry and Select tool from List of Available tools."  # instruct LLM to retry if bad
            else:
                result = self.tools[t['name']].invoke(t['args'])
            results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))
        print("Tools Execution Complete. Back to the model!")
        return {'messages': results} ## [ToolMessage, ToolMessage, ...]
    
    def run(self, db, patient_id, query):
        messages = messages = [HumanMessage(content=query)]
        res = self.graph.invoke({"messages": messages})
        try:
            return res['messages'][-1].content, None
        except Exception as e:
            return None, json.dumps(res)


if __name__=="__main__":
    query = "What is the average temprature of the patient 10001, and is it normal?"
    query = "Give me the address of the patient 10001"
    agent = ReActAgent(llm, tools, system=prompt)
    messages = [HumanMessage(content=query)]
    result = agent.graph.invoke({"messages": messages})

    print("====>", result['messages'][-1].content)

    # print(agent.run("", 10001, "What is the average temprature of the patient 10001, and is it normal?"))