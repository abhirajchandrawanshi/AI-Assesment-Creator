import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isRedisConnected = false;

export function getRedisConnection() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: REDIS_URL is not set. Falling back to In-Memory Queue.');
    isRedisConnected = false;
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 5000,
      lazyConnect: true
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('✅ Redis connected successfully.');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      isRedisConnected = false;
    });

    // Attempt connecting asynchronously
    redisClient.connect().catch((err) => {
      console.error('❌ Redis connection failed. Falling back to In-Memory Queue.', err.message);
      isRedisConnected = false;
    });

    return redisClient;
  } catch (error: any) {
    console.error('❌ Redis initialization failed. Falling back to In-Memory Queue.', error.message);
    isRedisConnected = false;
    return null;
  }
}

export function getIsRedisConnected() {
  return isRedisConnected;
}
export function closeRedis() {
  if (redisClient) {
    redisClient.disconnect();
    redisClient = null;
    isRedisConnected = false;
  }
}
