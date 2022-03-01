from time_intervals import parse_time, get_time_intervals, get_length

# (array(['CS', '171', 'Lab', 'Face To Face', '060',
#        'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22365?crseNumb=171',
#        '22365', 'Computer Programming I', 'W', '09:00 am - 10:50 am', '',
#        '', 'Mark W Boady, Adelaida A Medlock'], dtype='<U80'), array(['CS', '171', 'Lecture', 'Face To Face', 'A',
#        'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/22374?crseNumb=171',
#        '22374', 'Computer Programming I', 'M', '11:00 am - 12:50 pm',
#        'Mar 15, 2022', 'Final Exam:\n08:00 am - 10:00 am', 'Mark W Boady'],
#       dtype='<U80'))
def no_classes_during_time_interval_violations(schedule, constraints, all_sections):
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

def prefer_longer_classes_violations(schedule, constraints, all_sections):
    classes_timedelta = {
            "Su": -1,
            "M": 0,
            "T": 1,
            "W": 2,
            "R": 3,
            "F": 4,
            "S": 5,
    }
    if not constraints["prefer_longer_classes"][1]: return 0
    violations = 0
    for i, course in enumerate(all_sections):
        # Find the longest class time
        longest_time = max(course, key=get_length)
        # If the duration of the class in the schedule is not the longest, increment violations
        class_time = get_length(schedule[i])
        if class_time < longest_time: violations += 1
    return violations

def preferred_class_gap_interval_violations(schedule, constraints, all_sections):
    ideal_gap = constraints["preferred_class_gap_interval"][1]
    time_intervals = get_time_intervals(schedule)
    non_ideal_gap = 0 # in minutes
    for i in range(1, len(time_intervals)):
        gap = (time_intervals[i][0] - time_intervals[i-1][1]).total_seconds() / 60
        non_ideal_gap += abs(ideal_gap - gap) / 60
    #print("3. " + str(non_ideal_gap))
    return non_ideal_gap
