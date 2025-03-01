from flask import request, Response, json, Blueprint, current_app

# user controller blueprint to be registered with api blueprint
viewer_db = Blueprint("viewer_db", __name__)


@viewer_db.route('/find_patient_of_doctor/<doctor_id>', methods = ["GET"])
def get_patient_of_doctor(doctor_id):
    try:
        db = current_app.patient_doctor_db
        if not db.if_doctor_exists(doctor_id):
            return Response(
                response=json.dumps({'status': "failed",
                                        'message': "Doctor with this doctor_id does not exists"}),
                status=400,
                mimetype='application/json'
            )
        res, msg = db.get_patient_of_doctor(doctor_id)
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
    
@viewer_db.route('/get_doctor_detail/<doctor_id>', methods = ["GET"])
def get_doctor_detail(doctor_id):
    try:
        db = current_app.patient_doctor_db
        if not db.if_doctor_exists(doctor_id):
            return Response(
                response=json.dumps({'status': "failed",
                                        'message': "Doctor with this doctor_id does not exists"}),
                status=400,
                mimetype='application/json'
            )
        res, msg = db.get_doctor_detail(doctor_id)
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

@viewer_db.route('/get_my_doctor_detail/<patient_id>', methods = ["GET"])
def get_doctor_of_patient(patient_id):
    try:
        db = current_app.patient_doctor_db
        if not db.if_patient_exists(patient_id):
            return Response(
                response=json.dumps({'status': "failed",
                                        'message': "Patient with this doctor_id does not exists"}),
                status=400,
                mimetype='application/json'
            )
        res, msg = db.get_doctor_of_patient(patient_id)
        if res:
            return get_doctor_detail(res[0])
        else:
            return Response(
                response=json.dumps({
                    'status': "failed",
                    'message': msg
                }),
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

@viewer_db.route('/get_patient_detail/<patient_id>', methods = ["GET"])
def get_patient_detail(patient_id):
    try:
        db = current_app.patient_doctor_db
        if not db.if_patient_exists(patient_id):
            return Response(
                response=json.dumps({'status': "failed",
                                        'message': "Patient with this doctor_id does not exists"}),
                status=400,
                mimetype='application/json'
            )
        res, msg = db.get_patient_detail(patient_id)
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
    
@viewer_db.route('/login', methods = ["POST"])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        if email is None or password is None:
            return Response(
                response=json.dumps({'status': "failed", 
                                     "message": "Email and password are required"}),
                status=400,
                mimetype='application/json'
            )
        db = current_app.patient_doctor_db
        res, msg = db.login_user(email, password)
        if res:
            return Response(
                response=json.dumps(res),
                status=200,
                mimetype='application/json'
            )
        else:
            return Response(
                response=json.dumps({'status': "failed", 
                                     "message": "Invalid credentials",
                                     "error": msg}),
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