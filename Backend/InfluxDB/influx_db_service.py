import os, time
from influxdb_client_3 import InfluxDBClient3, Point
import json
import random


class InfluxDB:
    def __init__(self, host, token, org, database):
        self.client = InfluxDBClient3(host=host, token=token, org=org)
        self.database = database

    def execute_query(self, query):
        table = self.client.query(query=query, database=self.database, language="sql")

        # Convert to dataframe
        df = table.to_pandas().sort_values(by="time")
        print(df)

    def find_vital_signs_by_patient_id_via_dates(self, patient_id, vital_sign, start_time, end_time, return_json=False):
        query = f"""SELECT *
        FROM '{patient_id}'
        WHERE time >= timestamp '{start_time}' AND time <= timestamp '{end_time}'
        AND ("value" IS NOT NULL)
        AND "vital" IN ('{vital_sign}')"""

        try:
            table = self.client.query(query=query, database="VitalSigns", language="sql")
            df = table.to_pandas().sort_values(by="time")
            # print(df)
        except Exception as e:
            return None, str(e)
        
        if return_json:
            return df.to_json(orient="records"), None
        return df, None

    def find_vital_signs_by_patient_id_via_time(self, patient_id, vital_sign, past_hours, return_json=False):
        query = f"""SELECT *
        FROM '{patient_id}'
        WHERE time >= now() - interval '{past_hours} hours'
        AND ("value" IS NOT NULL)
        AND "vital" IN ('{vital_sign}')"""

        try:
            table = self.client.query(query=query, database="VitalSigns", language="sql")
            df = table.to_pandas().sort_values(by="time")
            # print(df)
        except Exception as e:
            return None, str(e)
        
        if return_json:
            return df.to_json(orient="records"), None
        return df, None
    
    #This is for chatbot only
    def find_avg_vital_signs_by_patient_id_for_today(self, patient_id, vital_sign, return_json=False):
        query = f"""SELECT mean("value") as "average"
        FROM '{patient_id}'
        WHERE time >= now() - interval '1d'
        AND ("value" IS NOT NULL)
        AND "vital" IN ('{vital_sign}')"""

        try:
            table = self.client.query(query=query, database="VitalSigns", language="sql")
            df = table.to_pandas().sort_values(by="time")
            # print(df)
        except Exception as e:
            return None, str(e)
        
        if return_json:
            return df.to_json(orient="records"), None
        return df, None
    
    def find_avg_vital_signs_by_patient_id_for_week(self, patient_id, vital_sign, return_json=False):
        query = f"""SELECT mean("value") as "average"
        FROM '{patient_id}'
        WHERE time >= now() - interval '7d'
        AND ("value" IS NOT NULL)
        AND "vital" IN ('{vital_sign}')"""

        try:
            table = self.client.query(query=query, database="VitalSigns", language="sql")
            df = table.to_pandas().sort_values(by="time")
            # print(df)
        except Exception as e:
            return None, str(e)
        
        if return_json:
            return df.to_json(orient="records"), None
        return df, None

if __name__ == "__main__":
    token = "=="
    org = "WeCare"
    host = "https://us-east-1-1.aws.cloud2.influxdata.com"
    database="VitalSigns"
    idb = InfluxDB(host=host, token=token, org=org, database=database)

    idb.find_vital_signs_by_patient_id_via_time("20001", "Temperature", 2, return_json=True)
