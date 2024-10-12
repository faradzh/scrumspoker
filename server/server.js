const express = require("express");

const app = express();

const PORT = 3000;

const messages = [
  { id: 1, text: "whatsssap" },
  { id: 2, text: "another message" },
];

app.get("/", (req, res) => {
  res.send("Helloooo!");
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

// app.use(express.static());
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});
