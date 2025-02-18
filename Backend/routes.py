from flask import Blueprint
from Controllers.write_db_controller import admin_db
from Controllers.read_db_controller import viewer
# main blueprint to be registered with application


api = Blueprint('api', __name__)

# register user with api blueprint
api.register_blueprint(admin_db, url_prefix="/admin")
api.register_blueprint(viewer, url_prefix="/viewer")