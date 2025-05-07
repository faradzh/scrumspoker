import mongoose from "mongoose";

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, clientOptions);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
