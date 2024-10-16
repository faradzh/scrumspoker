const https = require("https");
const fs = require("fs");

const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT || 80;

const options = {
  cert: fs.readFileSync(process.env.CERT_FULLCHAIN_PATH),
  key: fs.readFileSync(process.env.CERT_PRIVATE_KEY),
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Listening securely on port: ${PORT}...`);
});
