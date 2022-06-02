const http2 = require("http2");
const dotenv = require("dotenv");
dotenv.config();
const os = require("os");
const cluster = require("cluster");
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const landingPageStatic = path.resolve(__dirname + "/files/landingPage");
const landingPage = path.resolve(__dirname + "/files/landingPage/index.html");
const authStatic = path.resolve(__dirname + "/files/auth");
const auth = path.resolve(__dirname + "/files/auth/index.html");
const PORT = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
const numCPUs = os.cpus().length;

const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 25, // Limit each IP to 30 requests per `window` (here, per 2 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died, Starting new worker`);
    cluster.fork();
  });
} else {
  app.use(helmet());
  app.use(rateLimiter);
  app.use(compression());
  app.use(morgan("tiny"));

  app.set("port", PORT);
  app.set("env", node_env);

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.DOMAIN_NAME}`); // restrict it to the required domain
    res.setHeader("Access-Control-Allow-Methods", "GET");
    next();
  });

  app.get("/", (req, res) => {
    app.use(express.static(landingPageStatic));
    res.status(200).sendFile(landingPage);
  });

  app.get("/auth/*", (req, res) => {
    app.use(express.static(authStatic));
    res.status(200).sendFile(auth);
  });

  app.listen(PORT, () => console.log(`Running on ${PORT}!`));
}
