const express = require("express");
const path = require("path");

const api = express();

const messages = [
  { id: 1, text: "whatsssap" },
  { id: 2, text: "another message" },
];

api.use(express.static(path.join(__dirname, "public")));

api.get("/messages", (req, res) => {
  res.json(messages);
});

api.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = api;
