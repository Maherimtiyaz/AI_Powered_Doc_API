import redis

r = redis.Redis(host="localhost", port=6379)

def get_cache(key):
    return r.get(key)

def set_cache(key, value):
    r.setex(key, 300, value)


cache = {}

def get_cache(key):
    return cache.get(key)

def set_cache(key, value, ttl=None):
    cache[key] = value