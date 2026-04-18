import redis
import os

redis_client = redis.from_url(os.getenv("REDIS_URL"))

def test_redis():
    redis_client.set("health_check", "ok")
    return redis_client.get("health_check")