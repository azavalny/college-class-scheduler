import datetime
from .time_intervals import get_time_intervals

def overlapping_classes_violations(schedule):
    # Checks if a given schedule had overlapping classes
    # Get sorted time intervals by start time
    intervals = get_time_intervals(schedule)
    for x in range(1,len(intervals)):
        # If the current interval overlaps with the previous, hard constraint violated
        if intervals[x-1][1] > intervals[x][0]:
            return True
    return False
