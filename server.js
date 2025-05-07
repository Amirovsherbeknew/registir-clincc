const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware: parse body
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    if (!req.body.id) {
      console.log('l;ksal;ksdl;asdsa')
      req.body.id = Math.floor(10000 + Math.random() * 90000);
    }

    const keysToConvert = ['clientId', 'doctorId', 'roomId','id'];
    keysToConvert.forEach(key => {
      if (req.body[key] && typeof req.body[key] === 'string') {
        const parsed = parseInt(req.body[key]);
        if (!isNaN(parsed)) {
          req.body[key] = parsed;
        }
      }
    });
  }
  next();
});

// Custom render for pagination
router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCount = headers['x-total-count'];

  if (req.method === 'GET' && totalCount) {
    res.jsonp({
      data: res.locals.data,
      pagination: {
        total: parseInt(totalCount),
        page: parseInt(req.query._page || 1),
        limit: parseInt(req.query._limit || res.locals.data.length)
      }
    });
  } else {
    res.jsonp(res.locals.data);
  }
};

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('🚀 JSON Server running at http://localhost:3001');
});
