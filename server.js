const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
dotenv.config();
require("./src/connection.js");

const { initWebSocket } = require("./src/services/websocket.service.js");
const router = require("./src/routes/router.js");
const { requestLogger } = require("./src/middlewares/request.middleware.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(mongoSanitize());
app.use(requestLogger);
app.use("/api", router);

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

app.get("/", (req, res) => {
  return res.json({ message: "API server is running!" });
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

initWebSocket(server);
