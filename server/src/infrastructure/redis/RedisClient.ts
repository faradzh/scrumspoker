import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (error) => {
  console.error("Error connecting to Redis", error);
});

export default redisClient;