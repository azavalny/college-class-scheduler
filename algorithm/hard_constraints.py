import datetime
from time_intervals import get_time_intervals

# ('CI', '102', 'Lecture', 'Face To Face', 'F', 'https://termmasterschedule.drexel.edu/webtms_du/courseDetails/25110?crseNumb=102', '25110', 'Computing and Informatics Design II', 'T', '02:00 pm - 02:50 pm', '', '', 'Dave H Augenblick')
# - No overlapping courses
def overlapping_classes_violations(schedule):
    # Get sorted time intervals by start time
    intervals = get_time_intervals(schedule)
    for x in range(1,len(intervals)):
        # If the current interval overlaps with the previous, hard constraint violated
        if intervals[x-1][1] > intervals[x][0]:
            return True
    return False
