import os, time
from influxdb_client_3 import InfluxDBClient3, Point
from dotenv import load_dotenv
import json
import random
load_dotenv()

token = os.environ.get("INFLUXDB_TOKEN")
org = "WeCare"
host = "https://us-east-1-1.aws.cloud2.influxdata.com"

client = InfluxDBClient3(host=host, token=token, org=org)
database="VitalSigns"


query1 = """SELECT *
FROM 'census'
WHERE time >= now() - interval '24 hours'
AND ('bees' IS NOT NULL OR 'ants' IS NOT NULL)"""


query2 = """SELECT mean(count)
FROM "census"
WHERE time > now() - 10m"""



def execute_query(query):
    # Execute the query
    # table = client.query(query=query, database="VitalSigns", language="influxql")
    table = client.query(query=query, database="VitalSigns", language="sql")

    # Convert to dataframe
    df = table.to_pandas().sort_values(by="time")
    print(df)

if __name__ == "__main__":
    execute_query(query=query1)