from flask import request, Response, json, Blueprint, current_app

# user controller blueprint to be registered with api blueprint
admin_db = Blueprint("admin", __name__)

        
@admin_db.route('/add_doctor', methods = ["POST"])
def add_doctor():
    try:
        data = request.json
        if "doctor_id" in data and "name" in data:
            db = current_app.patient_doctor_db
            if db.if_doctor_exists(data['doctor_id']):
                return Response(
                    response=json.dumps({'status': "failed",
                                         'message': "Doctor with this doctor_id already exists"}),
                    status=400,
                    mimetype='application/json'
                )
            data.setdefault('speciality', None)
            data.setdefault('phone', None)
            data.setdefault('email', None)
            data.setdefault('hospital', None)

            res, msg =  db.add_doctor(doctor_id=data['doctor_id'], name=data['name'], specialty=data['speciality'], phone=data['phone'], email=data['email'], hospital=data['hospital'])
            if res:
                return Response(
                    response=json.dumps(msg),
                    status=200,
                    mimetype='application/json'
                )
            else:
                return Response(
                    response=json.dumps(msg),
                    status=404,
                    mimetype='application/json'
                )
        else:
            return Response(
                response=json.dumps({'status': "failed",
                                     'message': "doctor_id and name are required"}),
                status=400,
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
    

@admin_db.route('/add_patient', methods = ["POST"])
def add_patient():
    try:
        data = request.json
        if "patient_id" in data and "patient_name" in data and "doctor_id"  in data:
            db = current_app.patient_doctor_db

            if not db.if_doctor_exists(data['doctor_id']):
                return Response(
                    response=json.dumps({'status': "failed",
                                         'message': "Doctor does not exists"}),
                    status=400,
                    mimetype='application/json'
                )
            if db.if_patient_exists(data['patient_id']):
                return Response(
                    response=json.dumps({'status': "failed",
                                         'message': "Patient with this patient_id already exists"}),
                    status=400,
                    mimetype='application/json'
                )

            data.setdefault('patient_phone', None)
            data.setdefault('patient_email', None)
            data.setdefault('patient_address', None)
            data.setdefault('patient_birthdate', None)

            res, msg =  db.add_patient(patient_id=data['patient_id'], name=data['patient_name'], phone=data['patient_phone'], email=data['patient_email'], address=data['patient_address'], birthdate=data['patient_birthdate'])
            res2, msg2 = db.assign_patient_to_doctor(data['doctor_id'], data['patient_id'])
            if res and res2:
                return Response(
                    response=json.dumps(msg+" "+msg2),
                    status=200,
                    mimetype='application/json'
                )
            else:
                return Response(
                    response=json.dumps(msg+" "+msg2),
                    status=404,
                    mimetype='application/json'
                )
            
        else:
            return Response(
                response=json.dumps({'status': "failed",
                                     'message': "patient_id, doctor_id and name are required"}),
                status=400,
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
    

# # route for login api/users/signin
# @readers.route('/analysis/<commodity>', methods = ["POST"])
# def analysis(commodity):
#     try: 
#         data = request.json
#         mongo_dao = current_app.mongo_dao

#         if "markets" in data and type(data['markets'])==list:
#             if len(data['markets']) == 0:
#                 data['markets'] = None
#             mongo_dao = current_app.mongo_dao
#             res = get_analysis(commodity=commodity, mongo_dao=mongo_dao, markets=data['markets'])
#             return Response(
#                 response=json.dumps(res),
#                 status=200,
#                 mimetype='application/json'
#             )
#         else:
#             return Response(
#                 response=json.dumps({'status': "failed",
#                                         "message": "markets should be a list"}),
#                 status=400,
#                 mimetype='application/json'
#             )
        
#     except Exception as e:
#         return Response(
#                 response=json.dumps({'status': "failed", 
#                                      "message": "Error Occured",
#                                      "error": str(e)}),
#                 status=500,
#                 mimetype='application/json'
#             )
    

# @readers.route('/graph', methods = ["POST"])
# def graph():
#     try:
#         data = request.json
#         mongo_dao = current_app.mongo_dao


#         valid, data = validate_request(request, ["commodity", "from_year", "to_year", "markets"])
#         if not valid:
#             return Response(
#                 response=json.dumps({'status': "failed",
#                                         "message": "from_year, to_year and market are required"}),
#                 status=400,
#                 mimetype='application/json'
#             )

#         if type(data['from_year']) == int and type(data['to_year']) == int and type(data['markets'])==list:
#                 if len(data['markets']) == 0:
#                     data['markets'] = None
#                 res = get_graph_yearwise(commodity=data["commodity"], mongo_dao=mongo_dao, from_year=data['from_year'], to_year=data['to_year'], markets=data['markets'])
#                 return Response(
#                     response=res,
#                     status=200,
#                     mimetype='application/json'
#                 )
#         else:
#             return Response(
#                 response=json.dumps({'status': "failed",
#                                     "message": "from_year and to_year and market should be int, int and list respectively"}),
#                 status=400,
#                 mimetype='application/json'
#             )
#     except Exception as e:
#         return Response(
#                 response=json.dumps({'status': "failed", 
#                                      "message": "Error Occured",
#                                      "error": str(e)}),
#                 status=500,
#                 mimetype='application/json'
#             )
    
# @readers.route('/get_commodities', methods = ["POST"])
# def get_commodity_l():
#     try:
#         mongo_dao = current_app.mongo_dao
#         res = get_commodities_list(mongo_dao=mongo_dao)
#         return Response(
#             response=json.dumps(res),
#             status=200,
#             mimetype='application/json'
#         )
#     except Exception as e:
#         return Response(
#                 response=json.dumps({'status': "failed", 
#                                      "message": "Error Occured",
#                                      "error": str(e)}),
#                 status=500,
#                 mimetype='application/json'
#             )
    
    
# @writers.route('/update/<commodity>', methods = ["POST"])
# def update_commodity(commodity):
#     try:
#         mongo_dao = current_app.mongo_dao
#         res = update_commodity_in_atlas(mongo_dao=mongo_dao, commodity=commodity)

#         if res:
#             return Response(
#                 response=json.dumps({'status': "success",
#                                     "message": "Data updated successfully"}), 
#                                     status=200)

#     except Exception as e:
#         return Response(response=json.dumps({"error": f"Internal Server Error: {str(e)}", 
#                                              "status": "failure"}), 
#                                              status=500)