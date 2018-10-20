const http = require('http');
const app = require('./app')            // ambil app sebelah
const port = process.env.port || 3000;
const server = http.createServer(app);  // listener



server.listen(port) // asign listener to a port