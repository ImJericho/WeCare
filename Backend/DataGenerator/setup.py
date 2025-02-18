import sqlite3
from DataBase import PatientDoctorDB


class SQLMetaDataGenerator:
    def __init__(self, db_name="psuedo_data_generator.db"):
        self.db_name = db_name
        self.psuedo_generator()

    def psuedo_generator(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensors (
            name TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            unit TEXT NOT NULL,
            min INTEGER NOT NULL,
            max INTEGER NOT NULL,
            algorithm TEXT NOT NULL
        )
        ''')
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            patient_id INTEGER PRIMARY KEY,
            active TEXT NOT NULL
        )
        ''')
        conn.commit()
        conn.close()

    def insert_sensor(self, name, type, unit, min, max, algorithm):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO sensors (name, type, unit, min, max, algorithm)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, type, unit, min, max, algorithm))
        conn.commit()
        conn.close()
    
    def insert_patient(self, patient_id, active):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO patients (patient_id, active)
        VALUES (?, ?)
        ''', (patient_id, active))
        conn.commit()
        conn.close()
    
    def get_all_patients(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        SELECT * FROM patients
        ''')
        patients = cursor.fetchall()
        conn.close()
        return patients
    
    def get_all_sensors(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        SELECT * FROM sensors
        ''')
        sensors = cursor.fetchall()
        conn.close()
        return sensors
    
    def update_patient(self, patient_id, active):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        UPDATE patients
        SET active = ?
        WHERE patient_id = ?
        ''', (active, patient_id))
        conn.commit()
        conn.close()

def add_sensors_meta_data():
    smdg = SQLMetaDataGenerator()
    sensors = [
        {
            "name": "Temperature Sensor",
            "type": "Temperature",
            "unit": "Celsius",
            "min": 35,
            "max": 40,
            "algorithm": "random"
        },
        {
            "name": "Heart Rate Sensor",
            "type": "Heart Rate",
            "unit": "BPM",
            "min": 60,
            "max": 200,
            "algorithm": "random"
        },
        {
            "name": "Oxygen Sensor",
            "type": "Oxygen",
            "unit": "Persentage",
            "min": 0,
            "max": 100,
            "algorithm": "random"
        },
        {
            "name": "Blood Pressure Sensor",
            "type": "Blood Pressure",
            "unit": "mmHg",
            "min": 60,
            "max": 200,
            "algorithm": "random"
        }
    ]

    for sensor in sensors:
        smdg.insert_sensor(sensor["name"], sensor["type"], sensor["unit"], sensor["min"], sensor["max"], sensor["algorithm"])

def add_patients_meta_data():
    db = PatientDoctorDB()
    patients, _ = db.get_patients()

    smdg = SQLMetaDataGenerator()
    for patient in patients:
        smdg.insert_patient(patient[0], 1)
