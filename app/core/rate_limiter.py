def check_rate_limit(user_id):
    key = f"rate:{user_id}"

    count = r.get(key)

    if count and int(count) > 100:
        return False

    r.incr(key)
    r.expire(key, 60)

    return True