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

    # TODO: reformat schedule
    # schedule = [
    #     { 'subject': 'CS', 'course_number': '164', 'section': '091', 'instructor': 'Dave H Augenblick', method: "Face To Face", 'days': 'MWF', 'start_time': '02:00 pm', 'end_time': '02:50 pm', 'location': '', 'seats_available': '', 'seats_total': '' },
    # ]
    # TODO: add start and end date (figure out which quarter and have preset variables with start and end date of term, 11 weeks apart)

#        ['CS', '171', 'Lab', 'Face To Face', '060',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22365?crseNumb=171',
#       '22365', 'Computer Programming I', 'W', '09:00 am - 10:50 am', '',
#       '', 'Mark W Boady, Adelaida A Medlock']
#
#        ['CS', '171', 'Lecture', 'Face To Face', 'A',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22374?crseNumb=171',
#       '22374', 'Computer Programming I', 'M', '11:00 am - 12:50 pm',
#       'Mar 15, 2022', 'Final Exam:\n08:00 am - 10:00 am', 'Mark W Boady']
#
#      ['CI', '102', 'Lab', 'Face To Face', '070',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22847?crseNumb=102',
#       '22847', 'Computing and Informatics Design II', 'F',
#       '01:00 pm - 02:50 pm', '', '', 'Chad E Peiper'],
#
#      ['CI', '102', 'Lecture', 'Face To Face', 'A',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21313?crseNumb=102',
#       '21313', 'Computing and Informatics Design II', 'T',
#       '09:00 am - 09:50 am', '', '', 'Tammy R Pirmann'],
#
#       ['CS', '164', 'Lab', 'Face To Face', '060',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21492?crseNumb=164',
#       '21492', 'Introduction to Computer Science', 'W',
#       '03:00 pm - 04:50 pm', '', '', 'Brian L Stuart'],
#
#       ['CS', '164', 'Lecture', 'Face To Face', 'A',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21493?crseNumb=164',
#       '21493', 'Introduction to Computer Science', 'M',
#       '03:00 pm - 04:50 pm', 'Mar 16, 2022',
#       'Final Exam:\n03:30 pm - 05:30 pm', 'Brian L Stuart'],
#
#       ['ENGL', '103', 'Lecture', 'Hybrid', '141',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22759?crseNumb=103',
#       '22759', 'Composition and Rhetoric III: Themes and Genres', 'T',
#       '12:30 pm - 01:50 pm', '', '', 'Fred Siegel'],
#
#       ['MATH', '123', 'Lecture', 'Face To Face', '002',
#       'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/20469?crseNumb=123',
#       '20469', 'Calculus III', 'MW', '06:00 pm - 07:50 pm', '', '',
#       'Sergio Zefelippo']
#   ]

    return {
        "schedule": schedule,
    }
