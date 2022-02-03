import sqlite3

conn = sqlite3.connect("class-scheduler\data\classes.db")
q = conn.cursor()

#Insert TMS classes into classes.db


def create_table(name):
    """Initializes table of with a certain name"""
    q.execute("""CREATE TABLE """ + name + """ (

    )""")
    conn.commit()
    conn.close()

def insert_into(data):
    """Insert data into database table"""
    q.execute("INSERT INTO _____ VALUES ()")

def get():
    """Fetches a row from the database table"""
    return q.fetchone()
