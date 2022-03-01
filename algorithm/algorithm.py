import sqlite3
import datetime
import numpy as np
import itertools

from populate_fake_data import populate_fake_data
from hard_constraints import overlapping_classes_violations
from soft_constraints import no_classes_during_time_interval_violations, prefer_longer_classes_violations, preferred_class_gap_interval_violations

def get_soft_constraint_violations(schedule, constraints, constraint_violation_functions, all_sections):
    soft_constraint_violations = {name: constraint_violation_functions["soft"][name](schedule, constraints, all_sections) for name in constraints if constraints[name][0] > 0}
    return soft_constraint_violations

def fitness(schedule, constraints, constraint_violation_functions, all_sections, max_fitness=100):
    # Return if violates any hard constraints
    for hard_constraint in constraint_violation_functions["hard"]:
        if constraint_violation_functions["hard"][hard_constraint](schedule):
            return 0
    soft_constraint_violations = get_soft_constraint_violations(schedule, constraints, constraint_violation_functions, all_sections)
    fitness = max_fitness
    # Reduce the fitness by the number of violations and the weight of the violation
    for constraint in soft_constraint_violations:
        fitness -= soft_constraint_violations[constraint] * constraints[constraint][0]
    return fitness

# all_sections = [
# [ ["CI", "102", "060",...], ["CI", "102", "061",...] ],
# [ ["CS", "164", "090",...], ["CS", "164", "091",...] ],
# ]
# Returns all combinations
# ex. [[1,2,3],[4,5,6],[7,8,9,10]] -> [[1,4,7],[1,4,8],...,[3,6,10]]
def get_all_possible_schdeules(all_sections):
    # Get all combinations of classes
    return list(itertools.product(*all_sections))

def algorithm():
    # Open SQL connection
    connection = sqlite3.connect("../data/courses.db")
    cursor = connection.cursor()

    # Get data
    courses, constraints = populate_fake_data()

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
        rows = cursor.execute(f'SELECT * FROM courses WHERE subject_code="{subject_code}" AND course_number="{course_number}"').fetchall()
        # Split course by type (ex. lecture, recitation, etc.)
        rows = np.array(rows)
        class_type = rows[:,2]
        class_type_diff = np.array([-1  if (class_type[i] != class_type[i-1]) else 0 for i in range(1,len(class_type))])
        rows = np.split(rows, np.where(class_type_diff)[0]+1)
        all_sections += rows

    # Create all possible schedules where hard constraints are not violated
    schedules = get_all_possible_schdeules(all_sections)

    # Get fitness of each
    fitnesses = [fitness(schedule, constraints, constraint_violation_functions, all_sections) for schedule in schedules]

    # Return schdule with highest fitness
    print(f"Max Fitness: {max(fitnesses)}")
    best_schedule_index = fitnesses.index(max(fitnesses))
    print(f"Best Schedule: {schedules[best_schedule_index]}")

    # Close SQL conneciton
    connection.commit()
    connection.close()
    return

if __name__ == "__main__":
    algorithm()
