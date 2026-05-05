import { redisClient } from '../config/redis.js';

const cacheKey = (shortCode) => `url:code:${shortCode}`;

const isRedisUsable = () => redisClient.isOpen;

export const getCachedUrl = async (shortCode) => {
  if (!isRedisUsable()) return null;

  const cachedValue = await redisClient.get(cacheKey(shortCode));
  return cachedValue ? JSON.parse(cachedValue) : null;
};

export const setCachedUrl = async (shortUrl) => {
  if (!isRedisUsable()) return;

  const payload = {
    id: shortUrl._id.toString(),
    owner: shortUrl.owner.toString(),
    originalUrl: shortUrl.originalUrl,
    shortCode: shortUrl.shortCode,
    expiresAt: shortUrl.expiresAt,
  };

  const ttlSeconds = shortUrl.expiresAt
    ? Math.max(1, Math.floor((new Date(shortUrl.expiresAt).getTime() - Date.now()) / 1000))
    : 60 * 60 * 24;

  await redisClient.set(cacheKey(shortUrl.shortCode), JSON.stringify(payload), {
    EX: ttlSeconds,
  });
};

export const deleteCachedUrl = async (shortCode) => {
  if (!isRedisUsable()) return;
  await redisClient.del(cacheKey(shortCode));
};
