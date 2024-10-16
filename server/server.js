const https = require("https");
const fs = require("fs");

const app = require("./app");

require("dotenv").config();

const PORT = 443;

const options = {
  cert: fs.readFileSync("/certs/fullchain1.pem"),
  key: fs.readFileSync("/certs/privkey1.pem"),
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});
