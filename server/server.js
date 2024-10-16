const https = require("https");
const fs = require("fs");

const app = require("./app");

require("dotenv").config();

const PORT = 443;

const options = {
  cert: fs.readFileSync("/etc/letsencrypt/live/scrumspoker.com/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/scrumspoker.com/privkey.pem"),
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});
