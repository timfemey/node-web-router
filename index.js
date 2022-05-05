const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;

app.set("port", PORT);
app.set("env", node_env);

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname + "/build/")));
  res.status(200).sendFile(path.resolve(__dirname + "/build/index.html"));
});
app.listen(PORT, () => console.log(`Running on ${PORT}!`));
