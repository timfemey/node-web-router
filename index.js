const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false, limit: "25mb" }));

const authStatic = path.resolve(__dirname + "/prod/auth");
const auth = path.resolve(__dirname + "/prod/auth/index.html");
const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 25, // Limit each IP to 30 requests per `window` (here, per 2 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.set("port", PORT);
app.set("env", node_env);
app.use(rateLimiter);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.DOMAIN_NAME}`); // restrict it to the required domain
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/", (req, res) => {
  app.use(express.static(authStatic, { maxAge: 700000000 }));
  res.status(200).sendFile(auth, { maxAge: 700000000 });
});
app.listen(PORT, () => console.log(`Running on ${PORT}!`));
