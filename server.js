const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const url = require('url');
// Middleware: parse body
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // yoki faqat frontend domeni
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

server.get('/checks/total', (req, res) => {
  const db = router.db; // lowdb instance
  const checks = db.get('checks').value();

  const queryParams = url.parse(req.url, true).query;

  let filtered = checks;

  // // Misol uchun isPaid filter
  // if (queryParams.isPaid !== undefined) {
  //   const isPaid = queryParams.isPaid === 'true';
  //   filtered = filtered.filter(check => check.isPaid === isPaid);
  // }
  // isPaid

  if (queryParams.isPaid !== undefined) {
    const isPaid = queryParams.isPaid === 'true'; // stringni aniq tekshirib olamiz
    filtered = filtered.filter(check => check.isPaid === isPaid);
  }

  // Qo‘shimcha filterlar: doctorId, roomId va boshqalar
  if (queryParams.doctorId) {
    filtered = filtered.filter(check => String(check.doctorId) === queryParams.doctorId);
  }

  if (queryParams.roomId) {
    filtered = filtered.filter(check => String(check.roomId) === queryParams.roomId);
  }

  if (queryParams['visitTypes_like']) {
    // queryParams['visitTypes_like'] ko‘pincha string bo‘ladi, 
    // agar array bo‘lishi ehtimoli bo‘lsa, shuni ham hisobga olish mumkin:
    const visitTypeLikes = Array.isArray(queryParams['visitTypes_like'])
      ? queryParams['visitTypes_like']
      : [queryParams['visitTypes_like']];

    filtered = filtered.filter(check =>
      // Har bir _like qiymat uchun visitTypes massivida shu substring mavjudmi:
      visitTypeLikes.every(likeVal =>
        check.visitTypes.some(vt => vt.includes(likeVal))
      )
    );
  }

  // Date filtering: create_at_gte va create_at_lte
  if (queryParams.create_at_gte) {
    const fromDate = new Date(queryParams.create_at_gte);
    filtered = filtered.filter(check => new Date(check.create_at) >= fromDate);
  }

  if (queryParams.create_at_lte) {
    const toDate = new Date(queryParams.create_at_lte);
    filtered = filtered.filter(check => new Date(check.create_at) <= toDate);
  }

  const total = filtered.reduce((sum, check) => sum + (check.totalPrice || 0), 0);

  res.json({ total });
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
