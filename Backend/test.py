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
from ChatBot import ReActAgent

if __name__=="__main__":


    model = "qwen-2.5-32b"
    api_key = ""
    idb = None
    chatbot = ReActAgent(api_key, model, idb)

    query1 = f"Following this I will be asking you several question about my child's health you have to answer them and please keep in your mind that our Patient_id is {str(20001)}"
    messages = [HumanMessage(content=query1)]
    res, msg = chatbot.run(20001, messages, 1)

    query1 = f"Following this I will be asking you several question about my child's health you have to answer them and please keep in your mind that our Patient_id is {str(20002)}"
    messages = [HumanMessage(content=query1)]
    res, msg = chatbot.run(20002, messages, 1)

    query1 = f"Following this I will be asking you several question about my child's health you have to answer them and please keep in your mind that our Patient_id is {str(20003)}"
    messages = [HumanMessage(content=query1)]
    res, msg = chatbot.run(20003, messages, 1)

    print(res)
    print(msg)
    print("")
    # messages = [HumanMessage(content=query)]
    # res, msg = chatbot.run(20001, messages, 1)
    # print(res)
    # print(msg)
    # print("")

    # print(res)
    # print(msg)