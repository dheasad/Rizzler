import mongoose from "mongoose";
import config from "../config/app.config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
