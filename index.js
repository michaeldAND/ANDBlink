const { app, BrowserWindow, Notification } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './Logo.png',
  });

  win.loadFile('index.html');
};

function createNotification(title, body) {
  const breakNotification = new Notification({ title, body });
  breakNotification.show();
}

app.whenReady().then(() => {
  createWindow();
  createNotification('This is a title', 'This is a body');
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
