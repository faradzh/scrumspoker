const express = require("express");
const path = require("path");

const app = express();

const messages = [
  { id: 1, text: "whatsssap" },
  { id: 2, text: "another message" },
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
