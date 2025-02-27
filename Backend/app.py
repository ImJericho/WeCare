from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from DataBase import PatientDoctorDB
from InfluxDB import InfluxDB
from ChatBot import ReActAgent
from routes import api
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()


app = Flask(__name__)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)
app.env = "DEVELOPMENT"

db_path = "patient_doctor.db"
app.patient_doctor_db = PatientDoctorDB(db_name=db_path)
logger.info("PatientDoctorDB initialized successfully")

token = os.environ.get("INFLUXDB_TOKEN")
org = "WeCare"
host = "https://us-east-1-1.aws.cloud2.influxdata.com"
database = "VitalSigns"
app.influx_db = InfluxDB(host=host, token=token, org=org, database=database)
logger.info("InfluxDB initialized successfully")

model = "qwen-2.5-32b"
api_key = os.environ.get("GROQ_API_KEY")
idb = InfluxDB(host=host, token=token, org=org, database=database)
app.chatbot = ReActAgent(api_key, model, idb)
logger.info("Chatbot initialized successfully")

app.register_blueprint(api, url_prefix="/api")
logger.info("API routes registered successfully")

if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 3000
    DEBUG = True
    app.run(host=HOST, port=PORT, debug=DEBUG)
