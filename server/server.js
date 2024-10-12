const http = require("http");
const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT;
const server = http.createServer(app);

// app.use(express.static());
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});
