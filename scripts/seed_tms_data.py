import sqlite3
import csv

with open('../data/tms_data.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for row in spamreader:
        # Split out data
        subject_code = row[0]
        course_number = row[1]
        instruction_type = row[2]
        instruction_method = row[3]
        section = row[4]
        crn_url = row[6]
        crn = row[7]
        course_title = row[8]
        days = row[9]
        times = row[10]
        finals_day = row[11]
        finals_time = row[12]
        instructor = row[13]

        # Create table
        connection = sqlite3.connect("classes.db")
        cursor = connection.cursor()
        # TODO
        cursor.execute(f"CREATE TABLE courses (name TEXT, species TEXT, tank_number INTEGER)")

        # Insert table
        # TODO
        q.execute("INSERT INTO _____ VALUES ()")
        conn.commit()
        conn.close()
