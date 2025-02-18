from flask import Flask
import os
from DataBase import PatientDoctorDB
from routes import api
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.env = 'DEVELOPMENT'
app.patient_doctor_db = PatientDoctorDB()
app.register_blueprint(api, url_prefix='/api')


if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 3001
    DEBUG = True
    app.run(host=HOST, port=PORT, debug=DEBUG)