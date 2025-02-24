from InfluxDB import InfluxDB
from DataBase import PatientDoctorDB
import os
import json

def find_avg_vital_sign(patient_id, vital_sign, days, return_json=False):
    token = os.environ.get("INFLUXDB_TOKEN")
    org = "WeCare"
    host = "https://us-east-1-1.aws.cloud2.influxdata.com"
    database="VitalSigns"
    idb = InfluxDB(host=host, token=token, org=org, database=database)

    res = idb.find_avg_vital_sign(patient_id, vital_sign, days, return_json)

    return res


def find_patient_details(patient_id, return_json=False):
    pdb = PatientDoctorDB()
    res = pdb.get_patient_detail(patient_id)
    return res

def find_doctor_details(doctor_id, return_json=False):
    pdb = PatientDoctorDB()
    res = pdb.get_doctor_detail(doctor_id)
    return res

def find_who_is_my_doctor(patient_id, return_json=False):
    pdb = PatientDoctorDB()
    doctor_id = pdb.get_doctor_of_patient(patient_id)[0][0]
    res = pdb.get_doctor_detail(doctor_id)
    return res