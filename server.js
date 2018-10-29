const http = require('http');
const app = require('./app.js')

const port = process.env.PORT || 3000;

console.log('Port ===> ' + port)

const server = http.createServer(app);

server.listen(port);
