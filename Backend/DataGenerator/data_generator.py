import os, time
from influxdb_client_3 import InfluxDBClient3, Point
from dotenv import load_dotenv
import random
import sqlite3
load_dotenv()

host="https://us-east-1-1.aws.cloud2.influxdata.com"
token=os.environ.get("INFLUXDB_TOKEN")
org="WeCare"
database="VitalSigns"


class DataGenerator:
    def __init__(self, host, token, org, database):
        load_dotenv()
        self.client = InfluxDBClient3(host=host, token=token, org=org)
        self.database = database

    def psuedo_data_generator(self, sensors, patients, sleep_time=1):
        while True:
            points = []
            for patient in patients:
                for sensor in sensors:
                    value = random.randint(sensor[3], sensor[4])
                    point = (
                        Point("census")
                        .measurement(patient[0])
                        .tag("vital", sensor[1])
                        .field("value", value)
                        .field("unit", sensor[2])
                    )
                    points.append(point)

            self.client.write(database=self.database, record=points)
            print(f"Uploading for {time.strftime('%Y-%m-%d %H:%M:%S')}")
            time.sleep(time)  # separate points by 1 second
        print("Complete. Return to the InfluxDB UI.")


def get_active_patients(db_name='psuedo_data_generator.db'):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT * FROM patients WHERE active=1")
    patients = c.fetchall()
    conn.close()
    return patients

def get_sensors(db_name='psuedo_data_generator.db'):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT * FROM sensors")
    sensors = c.fetchall()
    conn.close()
    return sensors

def generate_pseudo_data():
    generator = DataGenerator(host=host, token=token, org=org, database=database)
    patients = get_active_patients()
    sensors = get_sensors()
    generator.psuedo_data_generator(sensors, patients, 5)
