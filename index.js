const express = require("express");
const app = express();
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const node_env = process.env.NODE_ENV;

app.set("port", PORT);
app.set("env", node_env);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on port ${port}!`));
