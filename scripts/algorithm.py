import sqlite3
import datetime

def populate_fake_data():
    today = datetime.date.today()
    friday = today + datetime.timedelta((4-today.weekday()) % 7)
    wednesday = today + datetime.timedelta((2-today.weekday()) % 7)

    busy1 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=15, minute=30)
    busy2 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=17, minute=00)
    busy3 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=10, minute=00)
    busy4 = datetime.datetime(year=wednesday.year, month=wednesday.month, day=wednesday.day, hour=14, minute=30)

    courses = ["CS 164", "CI 102"]
    constraints = {
        "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
        "longer_classes": [0.2, True],
        "preferred_class_gap_interval": [0.1, 5],
    }
    return courses, constraints

# TODO: Alex
def violates_hard_constraints(schedule):
    return False

# TODO
def no_classes_during_time_interval_violations(schedule, soft_constraint_violations):
    return 2

# TODO
def longer_classes_violations(schedule, soft_constraint_violations):
    return 2

# TODO
def preferred_class_gap_interval_violations(schedule, soft_constraint_violations):
    return 2

# TODO
def get_soft_constraint_violations(schedule, constraints):
    soft_constraint_violations = {}
    if constraints["no classes_during_time_interval"][0] > 0:
        soft_constraint_violations = no_classes_during_time_interval_violations(schedule, soft_constraint_violations)
    if constraints["longer_classes"][0] > 0:
        soft_constraint_violations = longer_classes_violations(schedule, soft_constraint_violations)
    if constraints["preferred_class_gap_interval"][0] > 0:
        soft_constraint_violations = preferred_class_gap_interval_violations(schedule, soft_constraint_violations)
    return soft_constraint_violations

def fitness(schedule, constraints, max_fitness=100):
    # if violates_hard_constraints(schedule): return 0
    soft_constraint_violations = get_soft_constraint_violations(schedule, constraints)
    fitness = max_fitness
    for constraint in constraints:
        if constraint not in soft_constraint_violations:
            soft_constraint_violations[constraint] = 0
        fitness -= soft_constraint_violations[constraint] * constraints[constraint]

# TODO
# all_sections = [
# [ ["CI", "102", "060",...], ["CI", "102", "061",...] ],
# [ ["CS", "164", "090",...], ["CS", "164", "091",...] ],
# ]
def get_all_possible_schdeules(all_sections):
    # TODO: Split up classes into different lists for labs and recitations. Essentially you want the algorithm to pick one item from each list
    return [[], []]

def algorithm():
    connection = sqlite3.connect("../data/courses.db")
    cursor = connection.cursor()

    courses, constraints = populate_fake_data()

    # Get all course sections from database
    courses_and_numbers = [x.split(" ") for x in courses]
    all_sections = []
    for course_and_number in courses_and_numbers:
        subject_code = course_and_number[0]
        course_number = course_and_number[1]
        for row in cursor.execute(f'SELECT * FROM courses WHERE subject_code="{subject_code}" AND course_number="{course_number}"'):
            all_sections.append([row])

    # Create all possible schedules where hard constraints are not violated
    schedules = get_all_possible_schdeules(all_sections)

    # Get fitness of each
    fitnesses = [fitness(schedule, constraints) for schedule in schedules]

    # Return schdule with highest fitness
    print(f"Max Fitness: {max(fitnesses)}")
    best_schedule_index = fitnesses.index(max(fitnesses))
    print(f"Best Schedule: {schedules[best_schedule_index]}")
    return

    connection.commit()
    connection.close()

if __name__ == "__main__":
    algorithm()
