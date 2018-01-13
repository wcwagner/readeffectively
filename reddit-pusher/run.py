import os
import praw
import re
import time
from redis_queue import RedisQueue

# Gather Redis credentials set by env file (see docker-compose)
REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']
REDIS_DB = os.environ['REDIS_DB']
REDIS_QUEUE_NAME = os.environ['REDIS_QUEUE_NAME']
REDIS_QUEUE_NAMESPACE = os.environ['REDIS_QUEUE_NAMESPACE']

# Gather Reddit API credentials set by env file (see docker-compose)
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
USERNAME = os.environ['USERNAME']
PASSWORD = os.environ['PASSWORD']
USER_AGENT = 'Reddit-Pusher-Script'

# only matches Amazon links that mention books
ISBN_REGEX = re.compile('(amazon.co.*(?:dp|o|gp|-)/([0-9]{9}[X0-9]))')


def mentions_book(body):
    return ISBN_REGEX.search(body) is not None


def main():
    comment_queue = RedisQueue('reddit-book-stream', host=REDIS_HOST, port=REDIS_PORT)
    reddit = praw.Reddit(user_agent=USER_AGENT,
                         client_id=CLIENT_ID,
                         client_secret=CLIENT_SECRET,
                         username=USERNAME,
                         password=PASSWORD)

    # stream comments from r/all, pasue_after < 0 allows faster streaming
    for comment in reddit.subreddit('all').stream.comments(pause_after=-1):
        if comment and mentions_book(comment.body):
            comment_queue.put(comment.id)
            print(comment.id)
            print(f'reddit.com/api/info?id=t1_{comment.id}')


if __name__ == '__main__':
    main()
