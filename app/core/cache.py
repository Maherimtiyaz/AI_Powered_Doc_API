# -----------------------------
# 🔹 In-Memory Cache
# -----------------------------
# Simple dict-based cache. Suitable for single-instance deployments.
# For multi-instance, replace with Redis or similar.

cache = {}

def get_cache(key):
    return cache.get(key)

def set_cache(key, value, ttl=None):
    cache[key] = value