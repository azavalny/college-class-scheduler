import datetime

classes_timedelta = {
        "Su": -1,
        "M": 0,
        "T": 1,
        "W": 2,
        "R": 3,
        "F": 4,
        "S": 5,
}

def parse_time(date):
    """
    @param date - ex. '02:00 pm - 02:50 pm'
    @return result - ex. [14, 0, 14, 50]
    """
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
    today = datetime.date.today()
    intervals = []
    for classes in schedule:
        for day in list(classes[9]):
            # Parse each time interval
            class_day = today + datetime.timedelta((classes_timedelta[day]-today.weekday()) % 7)
            parsed_times = parse_time(classes[10])
            start = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[0], minute=parsed_times[1])
            end = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[2], minute=parsed_times[3])
            intervals.append([start, end])
    # Sort by start time
    intervals = sorted(intervals, key=lambda x: x[0])
    return intervals

def get_length(course):
    if course[8] == "TBD": course[8] = "S"
    today = datetime.date.today()
    # Parse time interval
    day = course[8][0]
    class_day = today + datetime.timedelta((classes_timedelta[day]-today.weekday()) % 7)
    parsed_times = parse_time(course[9])
    start = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[0], minute=parsed_times[1])
    end = datetime.datetime(year=class_day.year, month=class_day.month, day=class_day.day, hour=parsed_times[2], minute=parsed_times[3])
    return (end - start).total_seconds() / 60
