const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const waitOn = require('wait-on');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Nuxt frontendni ishga tushirish
  const nuxtDev = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    shell: true,
    stdio: 'inherit',
  });

  // Frontend ishga tushishini kutamiz
  const frontendUrl = 'http://localhost:3000';

  waitOn({ resources: [frontendUrl], timeout: 30000 }) // 30 soniyagacha kutadi
    .then(() => {
      win.loadURL(frontendUrl);
    })
    .catch((err) => {
      console.error('❌ Nuxt frontend yuklanmadi: ', err);
    });

  // JSON-serverni ishga tushirish, agar `db.json` mavjud bo‘lsa
  const dbPath = path.join(__dirname, 'db.json');
  if (fs.existsSync(dbPath)) {
    spawn('npx', ['json-server', '--watch', 'db.json', '--host', '0.0.0.0', '--port', '3001'], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit',
    });
  } else {
    console.warn('⚠️  db.json fayli topilmadi. json-server ishga tushmadi.');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
