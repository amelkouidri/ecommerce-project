// server.js
const dotenv = require('dotenv');
dotenv.config(); // ⚠️ Charger .env AVANT d'importer app

const http = require('http');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
