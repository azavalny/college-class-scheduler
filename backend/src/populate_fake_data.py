import datetime

def populate_fake_data():
    today = datetime.date.today()
    friday = today + datetime.timedelta((4-today.weekday()) % 7)
    wednesday = today + datetime.timedelta((2-today.weekday()) % 7)

    busy1 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=15, minute=30)
    busy2 = datetime.datetime(year=friday.year, month=friday.month, day=friday.day, hour=17, minute=00)
    busy3 = datetime.datetime(year=wednesday.year, month=wednesday.month, day=wednesday.day, hour=10, minute=00)
    busy4 = datetime.datetime(year=wednesday.year, month=wednesday.month, day=wednesday.day, hour=14, minute=30)

    ## User input
    courses = ["CS 171", "CI 102", "CS 164", "ENGL 103", "MATH 123"]
    constraints = {
        # constraint_name : [weight, data],
        "no_classes_during_time_interval": [0.8, [[busy1, busy2], [busy3, busy4]]],
        "prefer_longer_classes": [0.1, True],
        "preferred_class_gap_interval": [0.1, 1 * 60],
    }

    ## Validate user input
    # Validate no_classes_during_time_interval
    if not isinstance(constraints["no_classes_during_time_interval"][1], (list)):
        print(f"Invalid type for no_classes_during_time_interval")
        return
    # Validate longer_classes value
    if not isinstance(constraints["prefer_longer_classes"][1], (bool)):
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
