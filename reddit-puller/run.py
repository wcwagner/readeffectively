import os
import praw
import time
import redis
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
USER_AGENT = 'Reddit-Puller-Script'

def main():
    rq = RedisQueue('reddit-book-stream', host=REDIS_HOST, port=REDIS_PORT)
    reddit = praw.Reddit(user_agent=USER_AGENT,
                         client_id=CLIENT_ID,
                         client_secret=CLIENT_SECRET,
                         username=USERNAME,
                         password=PASSWORD)


if __name__ == '__main__':
    main()
