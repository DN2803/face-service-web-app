import redis
import time

_redis_limiter = redis.Redis(host='localhost', port=6379, decode_responses=True)
_X = 20
_RATE_LIMITS = {
    'a': {
        'minute': _X,
        'hour': 10*_X,
        'day': 50*_X
    },
    # assume that an admin manage at most 5 devs
    'd': {
        'minute': int(_X/5),
        'hour': 2*_X,
        'day': 10*_X
    }
}
_WINDOW_SIZES = {
    'minute': 60,
    'hour': 3600,
    'day': 86400
}

def fixed_window_limit(key_id, is_admin=True, admin_key_id=None): # ref: GPT
    if not is_admin and admin_key_id == None:
        raise Exception('An admin_key_id must be assign when is_admin=False')

    current_time = int(time.time())
    key_type = 'a' if is_admin else 'd'
    limits = _RATE_LIMITS[key_type]
    result = {}

    for window, limit in limits.items():
        window_size = _WINDOW_SIZES[window]
        window_start = current_time // window_size
        redis_key = f"rate_limit:{key_type}:{key_id}:{window}:{window_start}"
        
        # Tăng số lượng request và thiết lập TTL
        current_count = _redis_limiter.incr(redis_key)
        if current_count == 1:
            _redis_limiter.expire(redis_key, window_size)

        # Kiểm tra nếu vượt giới hạn
        if current_count > limit:
            result[window] = False
        else:
            result[window] = True

        # Kiểm tra tổng số request của admin nếu là dev
        if is_admin:
            admin_key = f"rate_limit:a:{admin_key_id}:{window}:{window_start}"
            admin_count = int(_redis_limiter.get(admin_key) or 0)
            if admin_count >= _RATE_LIMITS['a'][window]:
                result[window] = False

    # Trả về trạng thái
    if all(result.values()):
        # Nếu là dev, tăng thêm count cho admin
        if is_admin:
            for window in limits.keys():
                window_size = _WINDOW_SIZES[window]
                window_start = current_time // window_size
                admin_key = f"rate_limit:a:{admin_key_id}:{window}:{window_start}"
                _redis_limiter.incr(admin_key)
        return True, "Allowed."
    else:
        return False, f"Rate limit exceeded at {', '.join([k for k, v in result.items() if not v])} level."