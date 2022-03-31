import sqlite3
import csv

# Create table
connection = sqlite3.connect("../data/courses.db")
cursor = connection.cursor()
values = cursor.execute('SELECT DISTINCT instruction_type FROM courses').fetchall()
values = [value[0] for value in values]
print(values)

connection.commit()
connection.close()
