import sqlite3
import csv
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "fraud.db")
csv_path = os.path.join(base_dir, "powerbi_data.csv")

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
tables = [row[0] for row in cur.fetchall()]

selected_table = None

for table in tables:
    cur.execute(f'SELECT COUNT(*) FROM "{table}"')
    count = cur.fetchone()[0]
    if count > 0:
        selected_table = table
        break

if selected_table is None:
    print("No data found in fraud.db")
    conn.close()
    exit()

cur.execute(f'SELECT * FROM "{selected_table}"')
rows = cur.fetchall()
headers = [description[0] for description in cur.description]

with open(csv_path, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(headers)
    for row in rows:
        writer.writerow([row[header] for header in headers])

conn.close()

print("SUCCESS")
print("Power BI CSV created:")
print(csv_path)
print("Table exported:", selected_table)
print("Rows exported:", len(rows))
