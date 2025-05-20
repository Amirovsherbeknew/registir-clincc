const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const url = require('url');
const fs = require('fs');

// Middleware: parse body
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (['POST', 'PUT'].includes(req.method)) {
    if (!req.body.id) {
      req.body.id = Math.floor(10000 + Math.random() * 90000);
    }

    const keysToConvert = ['clientId', 'doctorId', 'roomId', 'id'];
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
  const db = router.db;
  const checks = db.get('checks').value();
  const queryParams = url.parse(req.url, true).query;

  let filtered = checks;

  if (queryParams.status) {
    filtered = filtered.filter(check => check.status === queryParams.status);
  }

  if (queryParams.doctorId) {
    filtered = filtered.filter(check => String(check.doctorId) === queryParams.doctorId);
  }

  if (queryParams.roomId) {
    filtered = filtered.filter(check => String(check.roomId) === queryParams.roomId);
  }

  if (queryParams['visitTypes_like']) {
    const visitTypeLikes = Array.isArray(queryParams['visitTypes_like'])
      ? queryParams['visitTypes_like']
      : [queryParams['visitTypes_like']];

    filtered = filtered.filter(check =>
      visitTypeLikes.every(likeVal =>
        check.visitTypes.some(vt => vt.includes(likeVal))
      )
    );
  }

  if (queryParams.create_at_gte) {
    const fromDate = new Date(queryParams.create_at_gte);
    filtered = filtered.filter(check => new Date(check.create_at) >= fromDate);
  }

  if (queryParams.create_at_lte) {
    const toDate = new Date(queryParams.create_at_lte);
    filtered = filtered.filter(check => new Date(check.create_at) <= toDate);
  }

  let total = filtered.reduce((sum, check) => sum + (check.totalPrice || 0), 0);
  if (queryParams['visitTypes_like']) {
    filtered = filtered.map(check => {
      return { ...check, totalPrice: check[queryParams['visitTypes_like']] };
    });
    total = filtered.reduce((sum, check) => sum + (check.totalPrice || 0), 0);
  }
  res.json({ total });
});

server.get('/reports', (req, res) => {
  const db = router.db;
  const checks = db.get('checks').value();
  const clients = db.get('clients').value();
  const queryParams = url.parse(req.url, true).query;

  let Reportfiltered = checks;

  if (queryParams.status) {
    Reportfiltered = Reportfiltered.filter(check => check.status === queryParams.status);
  }

  if (queryParams.doctorId) {
    Reportfiltered = Reportfiltered.filter(check => String(check.doctorId) === queryParams.doctorId);
  }

  if (queryParams.roomId) {
    Reportfiltered = Reportfiltered.filter(check => String(check.roomId) === queryParams.roomId);
  }

  if (queryParams['visitTypes_like']) {
    const visitTypeLikes = Array.isArray(queryParams['visitTypes_like'])
      ? queryParams['visitTypes_like']
      : [queryParams['visitTypes_like']];

    Reportfiltered = Reportfiltered.filter(check =>
      visitTypeLikes.every(likeVal =>
        check.visitTypes.some(vt => vt.includes(likeVal))
      )
    );
  }

  if (queryParams.create_at_gte) {
    const fromDate = new Date(queryParams.create_at_gte);
    Reportfiltered = Reportfiltered.filter(check => new Date(check.create_at) >= fromDate);
  }

  if (queryParams.create_at_lte) {
    const toDate = new Date(queryParams.create_at_lte);
    Reportfiltered = Reportfiltered.filter(check => new Date(check.create_at) <= toDate);
  }

  if (queryParams['visitTypes_like']) {
    Reportfiltered = Reportfiltered.map(check => {
      return { ...check, totalPrice: check[queryParams['visitTypes_like']] };
    });
  }

  if (queryParams._expand === 'client') {
    Reportfiltered = Reportfiltered.map(check => {
      const client = clients.find(c => c.id === check.clientId);
      return { ...check, client };
    });
  }

  Reportfiltered.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

  const page = parseInt(queryParams._page) || 1;
  const limit = parseInt(queryParams._limit) || Reportfiltered.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = Reportfiltered.slice(start, end);

  res.json({
    data: paginatedData,
    pagination: {
      total: Reportfiltered.length,
      page,
      limit
    }
  });
});

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

// ======== 🔁 AUTO ROOM LIMIT CHECK EACH 10 MINS ============
setInterval(() => {
  const db = router.db;
  const clients = db.get('clients').value();
  const rooms = db.get('rooms').value();

  const now = new Date();

  let updatedRooms = {};

  clients.forEach(client => {
    if (client.end_date && new Date(client.end_date) < now) {
      const roomId = client.roomId;
      const room = rooms.find(r => r.id === roomId);
      if (room && room.limit > 0) {
        updatedRooms[roomId] = room.limit - 1;
      }
    }
  });

  // Faqat kerakli roomlarni update qilamiz
  Object.entries(updatedRooms).forEach(([roomId, newLimit]) => {
    db.get('rooms')
      .find({ id: parseInt(roomId) })
      .assign({ limit: newLimit })
      .write();
  });

  console.log(`🔄 [${new Date().toISOString()}] Room limitlar yangilandi.`);
}, 1000); // 10 daqiqada bir (600000 ms)

// ============================================================

server.listen(3001, () => {
  console.log('🚀 JSON Server running at http://localhost:3001');
});
