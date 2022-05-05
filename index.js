const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;

app.set("port", PORT);
app.set("env", node_env);

app.get("/", (req, res) => {
  res.status(200).sendFile("./build/index.html");
});
app.listen(PORT, () => console.log(`Running on ${PORT}!`));
