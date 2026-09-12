import http from "http";
import app from "./app.js";
import connectDB from "./lib/database.js";
import config from "./config/app.config.js";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥");
  console.error(err.name, err.message);
  console.error(err.stack);

  server.close(() => {
    process.exit(1);
  });
});

export default server;
