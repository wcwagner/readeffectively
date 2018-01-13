import os
import psycopg2
from flask import Flask
from flask_restful import Api, Resource

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
api = Api(app)


class BookAPI(Resource):
    def get(self, isbn):
        return f'Discussion for ISBN: {isbn}'


class SubredditAPI(Resource):
    def get(self, subreddit):
        return f'Top books for r/{subreddit}'


api.add_resource(BookAPI, '/books/<string:isbn>')
api.add_resource(SubredditAPI, '/r/<string:subreddit>')
