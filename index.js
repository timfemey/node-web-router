const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
const authStatic = path.resolve(__dirname + "/prod/auth");
const auth = path.resolve(__dirname + "/prod/auth/index.html");

app.set("port", PORT);
app.set("env", node_env);

app.get("/", (req, res) => {
  app.use(express.static(authStatic));
  res.status(200).sendFile(auth);
});
app.listen(PORT, () => console.log(`Running on ${PORT}!`));
