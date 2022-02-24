import sqlite3
import datetime
import numpy as np
import itertools

def populate_fake_data():
    today = datetime.date.today()
    friday = today + datetime.timedelta((4-today.weekday()) % 7)
    wednesday = today + datetime.timedelta((2-today.weekday()) % 7)

    busy1 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=15, minute=30)
    busy2 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=17, minute=00)
    busy3 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=10, minute=00)
    busy4 = datetime.datetime(year=wednesday.year, month=wednesday.month, day=wednesday.day, hour=14, minute=30)

    courses = ["CS 171", "CI 102", "CS 164", "ENGL 103"]
    constraints = {
        # constraint_name : [weight, data],
        "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
        "longer_classes": [0., True],
        "preferred_class_gap_interval": [0.2, 1 * 60],
    }
    # Validate no_classes_during_time_interval
    if not isinstance(constraints["no_classes_during_time_interval"][1], (list)):
        print(f"Invalid type for no_classes_during_time_interval")
        return
    # Validate longer_classes value
    if not isinstance(constraints["longer_classes"][1], (bool)):
        print(f"Invalid type for longer_classes")
        return
    # Validate preferred_class_gap_interval value
    gap_interval_possibilities = [10] + [hours * 60 for hours in range(1, 9)]
    if constraints["preferred_class_gap_interval"][1] not in gap_interval_possibilities:
        print("preferred_class_gap_interval not valid")
        return
    # Validate constraint weights
    for constraint in constraints:
        weight = constraints[constraint][0]
        if not isinstance(weight, (float)):
            print(f"{constraint} weight not valid")
            return
        if weight > 1.0 or weight < 0.0:
            print(f"{constraint} weight out of bounds")
            return
    return courses, constraints

# Input: '02:00 pm - 02:50 pm'
# Output: [14, 0, 14, 50]
def parse_time(date):
    if (date == "TBD"): return [0, 0, 0, 0]
    result = []
    # Split into [start_time, end_time]
    times = date.split(" - ")
    for time in times:
        if time[-2:] == "pm":
            if int(time[:2]) == 12:
                result.append(int(time[:2]))
            else:
                result.append(int(time[:2]) + 12)
        elif time[-2:] == "am":
            result.append(int(time[:2]))
        result.append(int(time[3:5]))
    return result
# parse_time('02:00 pm - 02:50 pm')

def get_time_intervals(schedule):
    classes_timedelta = {
            "Su": -1,
            "M": 0,
            "T": 1,
            "W": 2,
            "R": 3,
            "F": 4,
            "S": 5,
    }
    today = datetime.date.today()
    intervals = []
    for classes in schedule:
        if classes[8] == "TBD": classes[8] = "S"
        for day in list(classes[8]):
            # Parse each time interval
            class_day = today + datetime.timedelta((classes_timedelta[day]-today.weekday()) % 7)
            parsed_times = parse_time(classes[9])
            start = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[0], minute=parsed_times[1])
            end = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[2], minute=parsed_times[3])
            intervals.append([start, end])
    # Sort by start time
    intervals = sorted(intervals, key=lambda x: x[0])
    return intervals

# ('CI', '102', 'Lecture', 'Face To Face', 'F', 'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/25110?crseNumb=102', '25110', 'Computing and Informatics Design II', 'T', '02:00 pm - 02:50 pm', '', '', 'Dave H Augenblick')
# - No overlapping courses
def violates_hard_constraints(schedule):
    # Get sorted time intervals by start time
    intervals = get_time_intervals(schedule)
    for x in range(1,len(intervals)):
        # If the current interval overlaps with the previous, hard constraint violated
        if intervals[x-1][1] > intervals[x][0]:
            return True
    return False

# (array(['CS', '171', 'Lab', 'Face To Face', '060',
#        'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22365?crseNumb=171',
#        '22365', 'Computer Programming I', 'W', '09:00 am - 10:50 am', '',
#        '', 'Mark W Boady, Adelaida A Medlock'], dtype='<U80'), array(['CS', '171', 'Lecture', 'Face To Face', 'A',
#        'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22374?crseNumb=171',
#        '22374', 'Computer Programming I', 'M', '11:00 am - 12:50 pm',
#        'Mar 15, 2022', 'Final Exam:\n08:00 am - 10:00 am', 'Mark W Boady'],
#       dtype='<U80'))
def no_classes_during_time_interval_violations(schedule, constraints):
    # Get and sort time restrictions by start time
    time_restrictions = constraints["no_classes_during_time_interval"][1]
    time_restrictions = sorted(time_restrictions, key=lambda x: x[0])
    time_intervals = get_time_intervals(schedule)
    # Calculate number of hours time restrictions overlaps with class time intervals
    overlap = 0 # in minutes
    for restriction in time_restrictions:
        for interval in time_intervals:
            overlap += max((min(interval[0], restriction[0]) - max(interval[1], restriction[1])).total_seconds() / 60, 0)
    return overlap

# TODO
def longer_classes_violations(schedule, constraints):
    return 0

def preferred_class_gap_interval_violations(schedule, constraints):
    ideal_gap = constraints["preferred_class_gap_interval"][1]
    time_intervals = get_time_intervals(schedule)
    non_ideal_gap = 0 # in minutes
    for i in range(1, len(time_intervals)):
        gap = (time_intervals[i][0] - time_intervals[i-1][1]).total_seconds() / 60
        non_ideal_gap += abs(non_ideal_gap - gap)
    return non_ideal_gap

def get_soft_constraint_violations(schedule, constraints):
    constraint_violation_functions = {
        "no_classes_during_time_interval": no_classes_during_time_interval_violations,
        "longer_classes": longer_classes_violations,
        "preferred_class_gap_interval": preferred_class_gap_interval_violations,
    }
    soft_constraint_violations = {name: constraint_violation_functions[name](schedule, constraints) if constraints[name][0] > 0 for name in constraints}
    return soft_constraint_violations

def fitness(schedule, constraints, max_fitness=100):
    # Return if violates any hard constraints
    if violates_hard_constraints(schedule): return 0
    soft_constraint_violations = get_soft_constraint_violations(schedule, constraints)
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
    fitnesses = [fitness(schedule, constraints) for schedule in schedules]

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
