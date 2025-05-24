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

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = router.db.get('users').value();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        role:user?.role
      }
    });
  } else {
    res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
  }
});

server.get('/reload/room', (req, res) => {
  try {
    taskManager();
    res.json({ message: 'Room limits updated successfully via manual reload' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update room limits' });
  }
});

server.get('/checks/total', (req, res) => {
  const db = router.db; // lowdb instance
  const checks = db.get('checks').value();
  const queryParams = url.parse(req.url, true).query;

  let filtered = checks;

  if (queryParams.status) {
    filtered = filtered.filter(check => check.status === queryParams.status);
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
  let partTotalSum = 0
  let total = filtered.reduce((sum, check) => {
    if (check.status === 'part_payment') {
      const partTotal = check.part_pay_price?.reduce((partSum, item) => partSum + Number(item.price), 0) || 0;
      partTotalSum = partTotal
      return sum + partTotal;
    } else {
      return sum + (check.totalPrice || 0);
    }
  }, 0);
  if (queryParams['visitTypes_like']) {
    filtered = filtered.map(check => {
      return {...check,totalPrice:check[queryParams['visitTypes_like']]}
    })
    total = filtered.reduce((sum, check) => sum + (check.totalPrice || 0), 0);
  }
  res.json({ total,partTotalSum });
});

server.get('/reports', (req, res) => {
  const db = router.db; // lowdb instance
  const checks = db.get('checks').value();
  const clients = db.get('clients').value()
  const queryParams = url.parse(req.url, true).query;

  let Reportfiltered = checks;

  // // Misol uchun isPaid filter
  // if (queryParams.isPaid !== undefined) {
  //   const isPaid = queryParams.isPaid === 'true';
  //   filtered = filtered.filter(check => check.isPaid === isPaid);
  // }
  // isPaid

  if (queryParams.status) {
    Reportfiltered = Reportfiltered.filter(check => check.status === queryParams.status);
  }

  // Qo‘shimcha filterlar: doctorId, roomId va boshqalar
  if (queryParams.doctorId) {
    Reportfiltered = Reportfiltered.filter(check => String(check.doctorId) === queryParams.doctorId);
  }

  if (queryParams.roomId) {
    Reportfiltered = Reportfiltered.filter(check => String(check.roomId) === queryParams.roomId);
  }

  if (queryParams['visitTypes_like']) {
    // queryParams['visitTypes_like'] ko‘pincha string bo‘ladi, 
    // agar array bo‘lishi ehtimoli bo‘lsa, shuni ham hisobga olish mumkin:
    const visitTypeLikes = Array.isArray(queryParams['visitTypes_like'])
      ? queryParams['visitTypes_like']
      : [queryParams['visitTypes_like']];

    Reportfiltered = Reportfiltered.filter(check =>
      // Har bir _like qiymat uchun visitTypes massivida shu substring mavjudmi:
      visitTypeLikes.every(likeVal =>
        check.visitTypes.some(vt => vt.includes(likeVal))
      )
    );
  }

  // Date filtering: create_at_gte va create_at_lte
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
      return {...check,totalPrice:check[queryParams['visitTypes_like']]}
    })
    console.log(queryParams['visitTypes_like'])
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

server.delete('/checks/:id', (req, res) => {
  const db = router.db;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const check = db.get('checks').getById(id).value();

  if (!check) {
    return res.status(404).json({ error: 'Check not found' });
  }

  db.get('checks').remove({ id:Number(id) }).write();

  res.status(200).json({ message: 'Check deleted successfully' });
});

server.delete('/clients/:id', (req, res) => {
  const db = router.db;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const check = db.get('clients').getById(id).value();

  if (!check) {
    return res.status(404).json({ error: 'Client not found' });
  }

  db.get('clients').remove({ id:Number(id) }).write();

  res.status(200).json({ message: 'Client deleted successfully' });
});


function taskManager() {
  const db = router.db;
  const clients = db.get('clients').value();
  const rooms = db.get('rooms').value();

  const now = new Date();
  let updatedRooms = {};
  let updateCount = 0;

  clients.forEach(client => {
    if (client.end_date && new Date(client.end_date) < now) {
      const roomId = client.roomId;
      const room = rooms.find(r => r.id === roomId);
      if (room && room.limit > 0) {
        updatedRooms[roomId] = room.limit - 1;
      }
    }
  });

  Object.entries(updatedRooms).forEach(([roomId, newLimit]) => {
    db.get('rooms')
      .find({ id: parseInt(roomId) })
      .assign({ limit: newLimit })
      .write();
    updateCount++;
  });

  console.log(`🔄 [${new Date().toISOString()}] ${updateCount} ta xona limiti yangilandi.`);
  return `Xonalardagi joylar tekshirildi va ${updateCount} nechta mijozlar olib tashlandi`;
}

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
