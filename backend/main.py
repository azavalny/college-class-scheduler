import sqlite3
from thefuzz import fuzz

def main():
    conn = sqlite3.connect("data\courses.db")
    title = input()
    query = getCoursesAndInfo(title, conn)
    print(query)

def getCoursesAndInfo(title, conn):
    """Returns course information of courses that share the same title as inputted. If no matches are found, fuzzy finding is implemented to look for the course with the most similar title to what the user entered"""
    q = conn.cursor()
    q.execute(f"SELECT * FROM courses WHERE course_title = '{title}'")
    rows = q.fetchall()

    q.execute("SELECT course_title from courses")
    all_course_titles = q.fetchall()

    if len(rows) == 0:
        similarity = 80
        for course in all_course_titles:
            if fuzz.token_sort_ratio(title, course[0]) > similarity:
                q.execute(f"SELECT * FROM courses WHERE course_title = '{course[0]}'")
                course_info = q.fetchall()
                rows.append(course_info)
    conn.commit()
    conn.close()
    return rows

if __name__ == "__main__":
    main()
