import datetime
from flask import Flask, send_from_directory
from flask import request
from flask_cors import CORS, cross_origin
from backend.src.algorithm import algorithm
from backend.src.time_intervals import parse_time
import sqlite3
import json

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

def format_schedule(schedule):
    school_year = 2022
    term_start_and_end_dates = {
        'fall': {
            'start': datetime.datetime(school_year, 9, 19),
            'end': datetime.datetime(school_year, 12, 4)
        },
        'winter': {
            'start': datetime.datetime(school_year + 1, 1, 3),
            'end': datetime.datetime(school_year + 1, 3, 12)
        },
        'spring': {
            'start': datetime.datetime(school_year + 1, 3, 28),
            'end': datetime.datetime(school_year + 1, 6, 4)
        },
        'summer': {
            'start': datetime.datetime(school_year + 1, 6, 21),
            'end': datetime.datetime(school_year + 1, 8, 29)
        },
    }

    def parse_class(course):
        term = 'fall'
        times = parse_time(course[10])
        start_time = f'{times[0]:02}:{times[1]:02}:00'
        end_time = f'{times[2]:02}:{times[3]:02}:00'
        return {
            'subject': course[0],
            'course_number': course[1],
            'instruction_type': course[2],
            'instruction_method': course[3],
            'section': course[4],
            'crn_url': course[5],
            'crn': course[6],
            'course_title': course[7],
            'days': course[8],
            'start_time': start_time,
            'end_time': end_time,
            'instructor': course[10],
            'start_date': term_start_and_end_dates[term]['start'], # TODO: figure out which quarter and have preset variables with start and end date of term, 11 weeks apart
            'end_date': term_start_and_end_dates[term]['end'],
        }
    return [parse_class(course) for course in schedule]

@app.route('/api/schedule', methods=['GET', 'POST'])
@cross_origin()
def get_schedule():
    data = request.get_json()
    courses = data['courses']
    constraints = data['constraints']

    #courses = ["CS 171", "CI 102", "CS 164", "ENGL 103"]
    #constraints = {
    #    # constraint_name : [weight, data],
    #    "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
    #    "prefer_longer_classes": [0., True],
    #    "preferred_class_gap_interval": [0.2, 1 * 60],
    #}

    if True:
        schedule = algorithm(courses, constraints)
    else:
        schedule = [
            ['CS', '171', 'Lab', 'Face To Face', '060',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22365?crseNumb=171',
            '22365', 'Computer Programming I', 'W', '09:00 am - 10:50 am', '',
            '', 'Mark W Boady, Adelaida A Medlock'],

            ['CS', '171', 'Lecture', 'Face To Face', 'A',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22374?crseNumb=171',
            '22374', 'Computer Programming I', 'M', '11:00 am - 12:50 pm',
            'Mar 15, 2022', 'Final Exam:\n08:00 am - 10:00 am', 'Mark W Boady'],

            ['CI', '102', 'Lab', 'Face To Face', '070',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22847?crseNumb=102',
            '22847', 'Computing and Informatics Design II', 'F',
            '01:00 pm - 02:50 pm', '', '', 'Chad E Peiper'],

            ['CI', '102', 'Lecture', 'Face To Face', 'A',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21313?crseNumb=102',
            '21313', 'Computing and Informatics Design II', 'T',
            '09:00 am - 09:50 am', '', '', 'Tammy R Pirmann'],

            ['CS', '164', 'Lab', 'Face To Face', '060',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21492?crseNumb=164',
            '21492', 'Introduction to Computer Science', 'W',
            '03:00 pm - 04:50 pm', '', '', 'Brian L Stuart'],

            ['CS', '164', 'Lecture', 'Face To Face', 'A',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/21493?crseNumb=164',
            '21493', 'Introduction to Computer Science', 'M',
            '03:00 pm - 04:50 pm', 'Mar 16, 2022',
            'Final Exam:\n03:30 pm - 05:30 pm', 'Brian L Stuart'],

            ['ENGL', '103', 'Lecture', 'Hybrid', '141',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22759?crseNumb=103',
            '22759', 'Composition and Rhetoric III: Themes and Genres', 'T',
            '12:30 pm - 01:50 pm', '', '', 'Fred Siegel'],

            ['MATH', '123', 'Lecture', 'Face To Face', '002',
            'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/20469?crseNumb=123',
            '20469', 'Calculus III', 'MW', '06:00 pm - 07:50 pm', '', '',
            'Sergio Zefelippo']
       ]
    for s in schedule:
        print(s)
    
    return {
        "schedule": json.dumps(schedule)
    }
    """
    "schedule": {
        "MATH 311":{ 
            start_date: datetime.datetime(school_year, 9, 19) #fall 2022
            end_date: datetime.datetime(school_year, 12, 4) #fall 2022
            start_time: 04:00 pm
            end_time: 04:50 pm
            subject: MATH
            days: F
            course_number: 12919
            section: 4
            course_title: Probability and Stats
                    }
            "CS 265":{
                ...
            }
    }

    const events = data.schedule.map((course) => {
        course.start_date = new Date(course.start_date)
        course.end_date = new Date(course.end_date)
        const start = new Date(`2022-04-01T${course.start_time}`)
        const end = new Date(`2022-04-01T${course.end_time}`)
        const duration = (end.getTime() - start.getTime()) || 0
        return {
          title: `${course.subject} ${course.course_number}-${course.section} ${course.course_title}`,
          start: course.start_date, // '2022-04-16T12:30:00',
          end: course.end_date, // '2022-04-16T13:30:00',
    """

@app.route('/api/courses', methods=['GET','POST'])
@cross_origin()
def get_courses():
    conn = sqlite3.connect("backend/data/courses.db")
    q = conn.cursor()
    q.execute(f"SELECT DISTINCT subject_code, course_number, course_title FROM courses")
    all_courses = q.fetchall()
    print(all_courses)
    return json.dumps(all_courses)


@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')