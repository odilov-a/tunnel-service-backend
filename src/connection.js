const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

if (!process.env.MONGO_URL) {
  console.error("MONGO_URL environment variable is not defined");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("db error", error.message));

const logFolder = path.join(__dirname, "log");

const logFileName = () => {
  const now = new Date();
  const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${now.getFullYear()}`;
  return path.join(logFolder, `${formattedDate}.mongodb.log`);
};

fs.mkdirSync(logFolder, { recursive: true });
let logStream = fs.createWriteStream(logFileName(), { flags: "a" });
logStream.on("error", (err) => {
  console.error(`Error writing to log file: ${err.message}`);
});

mongoose.set("debug", (collectionName, method, query, doc) => {
  const logMessage = `[${new Date().toISOString()}] ${collectionName}.${method} ${JSON.stringify(
    query
  )} ${JSON.stringify(doc)}\n`;
  if (logStream.path !== logFileName()) {
    logStream.end();
    logStream = fs.createWriteStream(logFileName(), { flags: "a" });
    logStream.on("error", (err) => {
      console.error(`Error writing to log file: ${err.message}`);
    });
  }
  logStream.write(logMessage, (err) => {
    if (err) console.error(`Error writing to log file: ${err.message}`);
  });
});
