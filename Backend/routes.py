from flask import Blueprint, request, jsonify, current_app
from Controllers.write_db_controller import admin_db
from Controllers.read_db_controller import viewer_db
from Controllers.read_sensors_controller import sensor_db
from Controllers.chatbot_controller import chatbot
import logging
import traceback
from datetime import datetime

# main blueprint to be registered with application


api = Blueprint("api", __name__)
logger = logging.getLogger(__name__)

# register user with api blueprint
api.register_blueprint(admin_db, url_prefix="/admin")
api.register_blueprint(viewer_db, url_prefix="/viewer")
api.register_blueprint(sensor_db, url_prefix="/sensor_data")
api.register_blueprint(chatbot, url_prefix="/chatbot")


@api.route("/chatbot/query", methods=["POST"])
def handle_message():
    try:
        logger.info("Received chatbot message request")
        data = request.json
        logger.debug(f"Request data: {data}")

        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_message = data.get("query")
        patient_id = data.get("patient_id", 20001)  # Default patient ID
        session_id = data.get("session_id", 1)

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Use current_app instead of request.app
        chatbot = current_app.chatbot

        # Process the message
        try:
            response, error = chatbot.run(patient_id, user_message, session_id)

            if error:
                logger.error(f"Chatbot error: {error}")
                return (
                    jsonify({"error": "Failed to process message", "details": error}),
                    400,
                )

            return jsonify({"reply": response, "timestamp": datetime.now().isoformat()})

        except Exception as e:
            logger.error(f"Chatbot processing error: {str(e)}")
            logger.error(traceback.format_exc())
            return (
                jsonify({"error": "Failed to process message", "details": str(e)}),
                400,
            )

    except Exception as e:
        logger.error(f"Route error: {str(e)}")
        logger.error(traceback.format_exc())
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "details": str(e),
                    "traceback": traceback.format_exc(),
                }
            ),
            500,
        )


# Add a health check endpoint
@api.route("/health", methods=["GET"])
def health_check():
    try:
        # Check if chatbot is initialized
        chatbot = current_app.chatbot
        chatbot_status = "initialized" if chatbot else "not initialized"

        return jsonify(
            {
                "status": "healthy",
                "chatbot_status": chatbot_status,
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "status": "unhealthy",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            500,
        )
