from flask import Flask
from flask import request
from flask_cors import CORS
from algorithm.algorithm import algorithm

app = Flask(__name__)
CORS(app)

@app.route('/api/get-schedule', methods=['GET'])
def test():
    return '12222'

@app.route('/api/get-schedule', methods=['POST'])
def get_schedule():
    courses = request.get_json('courses')
    constraints = request.get_json('constraints')

    #schedule = algorithm(courses, constraints)

    #courses = ["CS 171", "CI 102", "CS 164", "ENGL 103"]
    #constraints = {
    #    # constraint_name : [weight, data],
    #    "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
    #    "prefer_longer_classes": [0., True],
    #    "preferred_class_gap_interval": [0.2, 1 * 60],
    #}

    schedule = [
        ['CI', '102', 'Lecture', 'Face To Face', 'F', 'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/25110?crseNumb=102', '25110', 'Computing and Informatics Design II', 'T', '02:00 pm - 02:50 pm', '', '', 'Dave H Augenblick'],
        ["CS", "164", "091"],
    ]
    return {
        "schedule": schedule,
    }
