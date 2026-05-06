import { redisClient } from '../config/redis.js';
import { ApiError } from '../utils/ApiError.js';
import { getClientIp } from '../utils/requestMeta.js';

const memoryStore = new Map();

const getIdentity = (req, keyBy) => {
  if (keyBy === 'user' && req.user?._id) return `user:${req.user._id}`;
  return `ip:${getClientIp(req)}`;
};

const incrementMemory = (key, windowSeconds) => {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.expiresAt <= now) {
    memoryStore.set(key, {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    });
    return 1;
  }

  existing.count += 1;
  return existing.count;
};

export const rateLimiter = ({ name, limit, windowSeconds, keyBy = 'ip' }) => {
  return async (req, res, next) => {
    const identity = getIdentity(req, keyBy);
    const key = `rate:${name}:${identity}`;

    try {
      let count;

      if (redisClient.isOpen) {
        count = await redisClient.incr(key);

        if (count === 1) {
          await redisClient.expire(key, windowSeconds);
        }
      } else {
        count = incrementMemory(key, windowSeconds);
      }

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));

      if (count > limit) {
        throw new ApiError(429, 'Too many requests. Please try again later.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authRateLimit = rateLimiter({
  name: 'auth',
  limit: 10,
  windowSeconds: 15 * 60,
});

export const urlCreateRateLimit = rateLimiter({
  name: 'url-create',
  limit: 30,
  windowSeconds: 60 * 60,
  keyBy: 'user',
});

export const pasteCreateRateLimit = rateLimiter({
  name: 'paste-create',
  limit: 20,
  windowSeconds: 60 * 60,
  keyBy: 'user',
});

export const redirectRateLimit = rateLimiter({
  name: 'redirect',
  limit: 300,
  windowSeconds: 60,
});
