import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,

  reconnectOnError: (error) => {
    console.log("Reconnect on error", error);
    return true;
  },

  retryStrategy: (times) => {
    return Math.min(times * 100, 3000);
  },

  connectTimeout: 10000,
  autoResubscribe: true,
  maxRetriesPerRequest: 5,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (error) => {
  console.error("Error connecting to Redis", error);
});

export default redisClient;
