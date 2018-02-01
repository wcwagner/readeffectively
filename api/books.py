import json
import os
import psycopg2
from authenticate import requires_auth
from flask import Flask, request, abort
from flask_cors import CORS
from queries import SQL_TOP_BOOKS_BY_SUBREDDIT, SQL_TOP_COMMENTS_BY_ISBN, SQL_BOOK_BY_ISBN
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


def _fieldify_rows(cursor):
    """
    Returns list of dicts, where each dict {...,col_name: value,...} represents a row in the cursor
    """
    col_names = [desc[0] for desc in cur.description]
    row_dicts = []
    for row in cursor:
        dic = {col: val for col, val in zip(col_names, row)}
        row_dicts.append(dic)
    return row_dicts


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
    mentions = _fieldify_rows(cur)
    resp = {
        'data': {
            'mentions': mentions
        }
    }
    return json.dumps(resp)


@app.route('/api/book/<isbn>', methods=['GET'])
def book(isbn):
    params = {'ISBN': isbn}
    cur.execute(SQL_TOP_COMMENTS_BY_ISBN, params)
    comments = _fieldify_rows(cur)
    cur.execute(SQL_BOOK_BY_ISBN, params)
    if not cur.rowcount:
        abort(400)
    book_data = _fieldify_rows(cur)[0]
    resp = {
        'data': {
            'book': book_data,
            'comments': comments
        }
    }
    return json.dumps(resp)


@app.route('/api/shelves/<topic>')
@requires_auth
def shelve(topic):
    ...
