import json
import os
import psycopg2
from flask import Flask, request, abort
from flask_cors import CORS
from queries import *
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

    if 'sort' in request.args:
        ORDER_BY_COL = f'total{request.args["sort"].capitalize()}'
    else:
        ORDER_BY_COL = 'totalMentions'  # the deault

    if subreddit_name == 'all':
        subreddit = sql.Literal("%")  # matches anything
        params = None
    else:
        subreddit = sql.Placeholder("subreddit")
        params = {'subreddit': subreddit_name}

    # create the dynamic sql query based upon the sort and subreddit params
    query = sql.SQL(SQL_TOP_BOOKS_BY_SUBREDDIT) \
        .format(subreddit=subreddit, order_by_col=sql.Identifier(ORDER_BY_COL))
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

    params = {'isbn': isbn}
    if 'subreddit' in request.args and request.args['subreddit'] != 'all':
        subreddit_sql = sql.Placeholder('subreddit')
        params['subreddit'] = request.args['subreddit']
    else:
        subreddit_sql = sql.Literal('%%')  # match any subreddit

    query = sql.SQL(SQL_TOP_COMMENTS_BY_ISBN).format(subreddit=subreddit_sql)
    cur.execute(query, params)
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


@app.route('/api/comentions/<isbn>')
def comentions(isbn):
    params = {'isbn1': isbn}
    cur.execute(SQL_TOP_COMENTIONS, params)
    comentions = _fieldify_rows(cur)
    resp = {
        'data': {
            'comentions': comentions
        }
    }
    return json.dumps(resp)


@app.route('/api/shelves/<topic>')
def shelve(topic):
    ...
