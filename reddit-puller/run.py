import os
import time
import redis
from redis_queue import RedisQueue

REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']
REDIS_DB = os.environ['REDIS_DB']
REDIS_QUEUE_NAME = os.environ['REDIS_QUEUE_NAME']
REDIS_QUEUE_NAMESPACE = os.environ['REDIS_QUEUE_NAMESPACE']


def main():
    rq = RedisQueue('reddit-book-stream', host=REDIS_HOST, port=REDIS_PORT)
    red = redis.Redis(host='redis', port=6379)

if __name__ == '__main__':
    main()
