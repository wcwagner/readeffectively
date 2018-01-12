from flask import Flask
from flask_restful import Api, Resource

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
