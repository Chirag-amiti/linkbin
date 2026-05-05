import { createClient } from 'redis';
import { env } from './env.js';

export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error.message);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.warn('Redis connection skipped:', error.message);
  }
};
