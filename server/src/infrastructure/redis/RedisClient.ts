import Redis from "ioredis";

const redisClient = new Redis({
  host: "redis-14791.c60.us-west-1-2.ec2.redns.redis-cloud.com",
  port: 14791,
  username: "default",
  password: "hVUB9gp9zwYFS8OJaIpsquYdpQsAEeio",
  reconnectOnError: (error) => {
    console.log("Reconnect on error", error);
    return true;
  },
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (error) => {
  console.error("Error connecting to Redis", error);
});

export default redisClient;
