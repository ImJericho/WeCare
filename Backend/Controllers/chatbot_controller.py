from flask import request, Response, json, Blueprint, current_app

# user controller blueprint to be registered with api blueprint
chatbot = Blueprint("chatbot", __name__)

        
@chatbot.route('/query', methods = ["POST"])
def chat_query():
    try:
        data = request.json
        if "patient_id" in data and "query" in data:
            db = current_app.patient_doctor_db
            if not db.if_patient_exists(data['patient_id']):
                return Response(
                    response=json.dumps({'status': "failed",
                                         'message': "Patient with this patient_id do not exists"}),
                    status=400,
                    mimetype='application/json'
                )
            
            agent = current_app.chatbot
            res, msg = agent.run(db, data['patient_id'], data['query'])

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
        else:
            return Response(
                response=json.dumps({'status': "failed",
                                     'message': "patient_id and query are required"}),
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