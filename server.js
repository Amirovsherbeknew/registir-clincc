const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Auto-increment ID logic
let idCounter = Date.now();

// Middleware: set numeric ID if missing
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST' && !req.body.id) {
    // 5 xonali random id yaratish
    req.body.id = Math.floor(10000 + Math.random() * 90000); // 5 xonali tasodifiy raqam
  }

  // Convert string references like "clientId" to numbers if needed
  const keysToConvert = ['clientId', 'doctorId', 'roomId'];
  keysToConvert.forEach(key => {
    if (req.body[key] && typeof req.body[key] === 'string') {
      const parsed = parseInt(req.body[key]);
      if (!isNaN(parsed)) {
        req.body[key] = parsed;
      }
    }
  });

  next();
});

server.use(middlewares);
server.use(router);

// Start server
server.listen(3001, () => {
  console.log('🚀 JSON Server running at http://localhost:3001');
});
