import sqlite3
import datetime
import numpy as np
import itertools
from prettytable import PrettyTable
from tqdm import tqdm

from .populate_fake_data import populate_fake_data
from .hard_constraints import overlapping_classes_violations
from .soft_constraints import no_classes_during_time_interval_violations, prefer_longer_classes_violations, preferred_class_gap_interval_violations

"""
User Input:
courses = ["CS 171", "CI 102", "CS 164", "ENGL 103"]

constraints = {
    # constraint_name : [weight, data],
    "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
    "prefer_longer_classes": [0., True],
    "preferred_class_gap_interval": [0.2, 1 * 60],
}

Computed Values:
schedule = [
    ['CI', '102', 'Lecture', 'Face To Face', 'F', 'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/25110?crseNumb=102', '25110', 'Computing and Informatics Design II', 'T', '02:00 pm - 02:50 pm', '', '', 'Dave H Augenblick']
    ["CS", "164", "091",...] ],
]
all_sections = [
    [ ["CI", "102", "060",...], ["CI", "102", "061",...] ],
    [ ["CS", "164", "090",...], ["CS", "164", "091",...] ],
]
"""

def get_constraint_violations(schedule, constraints, constraint_violation_functions, all_sections, type="soft"):
    # Returns an object with the number of violations for each constraint of a given type
    soft_constraint_violations = {name: constraint_violation_functions[type][name](schedule, constraints, all_sections) for name in constraints if constraints[name][0] > 0}
    return soft_constraint_violations

def fitness(schedule, constraints, constraint_violation_functions, all_sections, max_fitness=100):
    # Return if violates any hard constraints
    for hard_constraint in constraint_violation_functions["hard"]:
        if constraint_violation_functions["hard"][hard_constraint](schedule):
            return 0
    soft_constraint_violations = get_constraint_violations(schedule, constraints, constraint_violation_functions, all_sections)
    fitness = max_fitness
    # Reduce the fitness by the number of violations and the weight of the violation
    for constraint in soft_constraint_violations:
        fitness -= soft_constraint_violations[constraint] * constraints[constraint][0]
    return fitness

def get_all_possible_schdeules(all_sections):
    # Get all combinations of classes
    # ex. [[1,2,3],[4,5,6],[7,8,9,10]] -> [[1,4,7],[1,4,8],...,[3,6,10]]
    return list(itertools.product(*all_sections))

def algorithm(courses = None, constraints = None):
    # Open SQL connection
    #import os
    #print(os.getcwd())
    connection = sqlite3.connect("backend/data/courses.db")
    cursor = connection.cursor()

    # Get data
    if courses is None and constraints is None:
        courses, constraints = populate_fake_data()
    else:
        # Parse dates
        for constraint in constraints:
            if constraint == "no_classes_during_time_interval":
                for interval in constraints[constraint][1]:
                    interval[0] = datetime.datetime.strptime(interval[0], '%Y-%m-%dT%H:%M:%S.000Z')
                    print("YEAR", interval[0].year)
                    interval[1] = datetime.datetime.strptime(interval[1], '%Y-%m-%dT%H:%M:%S.000Z')

    constraint_violation_functions = {
        "hard": {
            "overlapping_classes": overlapping_classes_violations,
        },
        "soft": {
            "no_classes_during_time_interval": no_classes_during_time_interval_violations,
            "prefer_longer_classes": prefer_longer_classes_violations,
            "preferred_class_gap_interval": preferred_class_gap_interval_violations,
        },
    }

    # Get all course sections from database
    all_sections = []
    for course in courses:
        course_data = course.split(" ")
        subject_code = course_data[0]
        course_number = course_data[1]
        # Get rows from database
        sql = "SELECT * FROM courses WHERE subject_code=(?) AND course_number=(?)"
        rows = cursor.execute(sql, (subject_code, course_number)).fetchall()
        # Split course by type (ex. lecture, recitation, etc.)
        rows = np.array(rows)
        # Remove special classes
        rows_to_delete = [i for i, x in enumerate(rows[:,2]) if " " in x and "Special Topics" not in x]
        rows = np.delete(rows, rows_to_delete, axis=0)
        # Separate different instruction types - ex. Lecture vs Recitation vs Lab
        class_type = rows[:,2]
        class_type_diff = []
        for i in range(1,len(class_type)):
            # Split if the instruction type changes
            if (class_type[i] != class_type[i-1]):
                class_type_diff.append(-1)
            else:
                class_type_diff.append(0)
        class_type_diff = np.array(class_type_diff)
        rows = np.split(rows, np.where(class_type_diff)[0]+1)
        if len(rows[0]) != 0: all_sections += rows

    # Create all possible schedules where hard constraints are not violated
    schedules = get_all_possible_schdeules(all_sections)

    # Get fitness of each
    fitnesses = [fitness(schedule, constraints, constraint_violation_functions, all_sections) for schedule in tqdm(schedules)]

    # Return schdule with highest fitness
    print(f"Max Fitness: {max(fitnesses):.2f}")

    # Print best schedule
    best_schedule_index = fitnesses.index(max(fitnesses))
    table = PrettyTable()
    print(f"Best Schedule: ")
    for course in schedules[best_schedule_index]:
        row = np.concatenate((course[:5], [course[6]], course[10:]), axis=0)
        table.add_row(row)
        #print(course)
    print(table)

    # Close SQL conneciton
    connection.commit()
    connection.close()
    print(schedules[best_schedule_index])
    return schedules[best_schedule_index]

if __name__ == "__main__":
    algorithm()
