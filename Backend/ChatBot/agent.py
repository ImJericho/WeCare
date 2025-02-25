from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langchain_core.tools import tool, StructuredTool
from langgraph.checkpoint.memory import MemorySaver
import operator
import json
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage
from ChatBot.prompts import prompt
from InfluxDB import InfluxDB
from ChatBot.helper import find_avg_vital_sign, find_patient_details, find_doctor_details, find_who_is_my_doctor

@tool
def get_avg_temperature(patient_id: int, days: int)-> float:
    """
    Returns average temperature for input patient_id and days.
    e.g. get_avg_temperature: 20001, 2
    Returns average temperature for patient_id 20001 for 2 days.
    """
    res = find_avg_vital_sign(patient_id, "Temperature", days, return_json=False)
    return res

@tool
def get_avg_blood_pressure(patient_id: int, days: int)-> float:
    """
    Returns average blood pressure for input patient_id and days.
    e.g. get_avg_blood_pressure: 20001, 2
    Returns average blood pressure for patient_id 20001 for 2 days.
    """
    res = find_avg_vital_sign(patient_id, "Blood_Pressure", days, return_json=False)
    return res

@tool
def get_avg_heart_rate(patient_id: int, days: int)-> float:
    """
    Returns average heart rate for input patient_id and days.
    e.g. get_avg_heart_rate: 20001, 2
    Returns average heart rate for patient_id 20001 for 2 days.
    """
    res = find_avg_vital_sign(patient_id, "Heart_Rate", days, return_json=False)
    return res

@tool
def get_avg_spo2(patient_id: int, days: int)-> float:
    """
    Returns average Oxygen for input patient_id and days.
    e.g. get_avg_spo2: 20001, 2
    Returns average respiratory rate for patient_id 20001 for 2 days.
    """
    res = find_avg_vital_sign(patient_id, "Oxygen", days, return_json=False)
    return res

@tool
def patient_details(patient_id: int)-> str:
    """
    Returns Patient Details for input patient_id.
    e.g. patient_details: 20001
    Returns Patient Details for patient_id 20001.
    """
    info = find_patient_details(patient_id)
    return json.dumps(info)

@tool 
def who_is_my_doctor(patient_id: int)-> str:
    """
    Returns the details of the Doctor for the given patient.
    e.g. who_is_my_doctor: 20001
    Returns Doctor Details for patient_id 20001.
    """
    info = find_who_is_my_doctor(patient_id)
    return json.dumps(info)

class AgentState(TypedDict): ## Agent's current state, it can be history of messsages and other attributes you want to maintain
    messages: Annotated[list[AnyMessage], operator.add]   ## {'messages': []}
        
class ReActAgent:
    
    def __init__(self, api_key, model_name, db):
        tools = [
            patient_details,
            who_is_my_doctor,
            get_avg_temperature,
            get_avg_blood_pressure,
            get_avg_heart_rate,
            get_avg_spo2
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
        memory = MemorySaver()
        self.graph = graph.compile(checkpointer=memory)

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
    
    def run(self, patient_id, query, session_id):
        updated_query = query+" for your refrence here is the Patient_id: "+str(patient_id)
        messages = messages = [HumanMessage(content=updated_query)]
        session_id = patient_id*10+session_id
        config = {"configurable": {"thread_id": f"{session_id}"}}
        res = self.graph.invoke({"messages": messages}, config)
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