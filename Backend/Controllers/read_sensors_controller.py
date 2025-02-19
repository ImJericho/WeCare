from flask import request, Response, json, Blueprint, current_app
from datetime import datetime

# user controller blueprint to be registered with api blueprint
sensor_db = Blueprint("sensor_data", __name__)


@sensor_db.route('/time/<patient_id>', methods = ["POST"])
def get_sensors_data_by_hours(patient_id):
    try:
        data = request.json
        if "sensor" not in data or "past_hours" not in data:
            return Response(
                response=json.dumps({'status': "failed",
                                     'message': "sensor is required"}),
                status=400,
                mimetype='application/json'
            )
        sensor = data['sensor']
        past_hours = data['past_hours']
        db = current_app.influx_db
        res, msg = db.find_vital_signs_by_patient_id_via_time(patient_id, sensor, past_hours, return_json=True)
        if res:
            return Response(
                response=json.dumps(res),
                status=200,
                mimetype='application/json'
            )
        else:
            return Response(
                response=json.dumps(msg),
                status=404,
                mimetype='application/json'
            )
    except Exception as e:
        return Response(
                response=json.dumps({'status': "failed", 
                                     "message": "Error Occured",
                                     "error": str(e)}),
                status=500,
                mimetype='application/json'
            )
    

@sensor_db.route('/dates/<patient_id>', methods = ["POST"])
def get_sensors_data_by_dates(patient_id):
    try:
        data = request.json
        if "sensor" not in data or "from_date" not in data or "to_date" not in data:
            return Response(
                response=json.dumps({'status': "failed",
                                     'message': "sensor is required"}),
                status=400,
                mimetype='application/json'
            )
        sensor = data['sensor']
        from_date = data['from_date']
        to_date = data['to_date']

        from_time = datetime.strptime(from_date, '%Y-%m-%d').isoformat() + 'Z'
        to_time = datetime.strptime(to_date, '%Y-%m-%d').isoformat() + 'Z'

        db = current_app.influx_db
        res, msg = db.find_vital_signs_by_patient_id_via_dates(patient_id, sensor, from_time, to_time, return_json=True)
        if res:
            return Response(
                response=json.dumps(res),
                status=200,
                mimetype='application/json'
            )
        else:
            return Response(
                response=json.dumps(msg),
                status=404,
                mimetype='application/json'
            )
    except Exception as e:
        return Response(
                response=json.dumps({'status': "failed", 
                                     "message": "Error Occured",
                                     "error": str(e)}),
                status=500,
                mimetype='application/json'
            )
    