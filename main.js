const {
  app, BrowserWindow, Notification, powerMonitor, ipcMain,
} = require('electron');
const path = require('path');
const { clearInterval } = require('timers');

const content = require('./data');
const Store = require('./store');

const contentStore = new Store();
let userSettings;
let tasks = [];

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    icon: './Logo.icns',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const isDev = process.env.NODE_ENV === 'DEVELOPMENT';

  win.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, './build/index.html')}`);
};

// cancels all active jobs
function cancelJobs() {
  tasks.forEach((job) => clearInterval(job));
}

function createNotification(title, body) {
  const notification = new Notification({ title, body });
  notification.show();
}

function getRandomInt(max) {
  const index = Math.floor(Math.random() * max);
  return Math.min(index, max - 1);
}

function scheduleJobs() {
  userSettings.forEach((setting, index) => {
    if (!setting.active) {
      return;
    }
    const job = setInterval(() => {
      console.log('notify to take break?', new Date(), tasks);
      // depending on the break size, show different messages
      const contentArray = setting.isShort ? content.short : content.long;
      const random = getRandomInt(contentArray.length);
      // replace title string with appropriate break time period
      let { title } = contentArray[random];
      title = title.replace('%REPLACE%', setting.message);
      createNotification(title, contentArray[random].body);
    }, (setting.workTime + setting.breakTime) * 1000);
    tasks[index] = job;
  });
}

// gets the content stored from file or from defaults
// cancels all active jobs and starts new ones when called
function refreshNotifications() {
  cancelJobs();
  userSettings = contentStore.get();
  tasks = new Array(userSettings.length);
  scheduleJobs();
}

app.whenReady().then(() => {
  createWindow();
  refreshNotifications();

  ipcMain.on('send-settings', (event, arg) => {
    contentStore.set(arg);
    refreshNotifications();
  });

  ipcMain.on('restore-defaults', (event) => {
    contentStore.resetToDefaults();
    userSettings = contentStore.get();
    event.sender.send('recieve-settings', userSettings);
  });

  ipcMain.on('handshake', (event) => {
    event.sender.send('recieve-settings', userSettings);
  });

  powerMonitor.on('suspend', () => {
    console.log('suspended');
    cancelJobs();
  });

  powerMonitor.on('resume', () => {
    console.log('resume');
    refreshNotifications();
  });

  powerMonitor.on('lock-screen', () => {
    console.log('locked');
    cancelJobs();
  });

  powerMonitor.on('unlock-screen', () => {
    console.log('unlocked');
    refreshNotifications();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
