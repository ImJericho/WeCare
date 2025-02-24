from flask import Blueprint
from Controllers.write_db_controller import admin_db
from Controllers.read_db_controller import viewer_db
from Controllers.read_sensors_controller import sensor_db
from Controllers.chatbot_controller import chatbot

# main blueprint to be registered with application


api = Blueprint('api', __name__)

# register user with api blueprint
api.register_blueprint(admin_db, url_prefix="/admin")
api.register_blueprint(viewer_db, url_prefix="/viewer")
api.register_blueprint(sensor_db, url_prefix="/sensor_data")
api.register_blueprint(chatbot, url_prefix="/chatbot")