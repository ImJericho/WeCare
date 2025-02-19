from flask import Flask
import os
from DataBase import PatientDoctorDB
from InfluxDB import InfluxDB
from routes import api
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.env = 'DEVELOPMENT'

db_path = 'patients_doctors.db'
app.patient_doctor_db = PatientDoctorDB(db_name=db_path)

token = os.environ.get("INFLUXDB_TOKEN")
org = "WeCare"
host = "https://us-east-1-1.aws.cloud2.influxdata.com"
database="VitalSigns"
app.influx_db = InfluxDB(host=host, token=token, org=org, database=database)



app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 3002
    DEBUG = True
    app.run(host=HOST, port=PORT, debug=DEBUG)