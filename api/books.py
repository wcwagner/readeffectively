import json
import os
import psycopg2
from authenticate import requires_auth
from flask import Flask, request
from flask_cors import CORS
from queries import SQL_TOP_BOOKS_BY_SUBREDDIT
from psycopg2 import sql

# Get env variables set by docker-compose
DB_USER = os.environ['POSTGRES_USER']
DB_PASSWORD = os.environ['POSTGRES_PASSWORD']
DB_HOST = 'db'
DB_PORT = '5432'
DB_NAME = os.environ['POSTGRES_DB']

# Try to establish conn to PostgreSQL db
try:
    CONN_STR = f"dbname='{DB_NAME}' user='{DB_USER}' host='{DB_HOST}' password='{DB_PASSWORD}'"
    conn = psycopg2.connect(CONN_STR)
    cur = conn.cursor()
except Exception as e:
    print('Unable to connect to database')
    raise

app = Flask(__name__)
CORS(app)


@app.route('/api/r/<subreddit_name>', methods=['GET'])
def subreddit(subreddit_name):
    ORDER_BY_COL = 'Total Mentions'  # the deault
    if 'sort' in request.args:
        ORDER_BY_COL = f'Total {request.args["sort"].capitalize()}'

    # Field Name & Table Name parameters must be handled outside of cur.excute()
    query = sql.SQL(SQL_TOP_BOOKS_BY_SUBREDDIT).format(sql.Identifier(ORDER_BY_COL))

    params = {
        'SUBREDDIT': subreddit_name,
    }
    cur.execute(query, params)

    return json.dumps(cur.fetchall())


@app.route('/api/book/<isbn>')
@requires_auth
def book(isbn):
    ...


@app.route('/api/shelves/<topic>')
@requires_auth
def shelve(topic):
    ...
