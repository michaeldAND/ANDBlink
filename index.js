const {
  app, BrowserWindow, Notification, powerMonitor,
} = require('electron');
const schedule = require('node-schedule');

const content = require('./data');
const Store = require('./store');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './Logo.icns',
  });

  win.loadFile('index.html');
};

const contentStore = new Store();

console.log(contentStore.get());

const relaxTimes = ['*/3 * * * * *', '*/1 * * * * *'];

function createNotification(title, body) {
  const breakNotification = new Notification({ title, body });
  breakNotification.show();
}

function restartJob(job, isWork) {
  const timer = relaxTimes[isWork ? 0 : 1];
  job.reschedule(timer);
}

function getRandomInt(max) {
  const index = Math.floor(Math.random() * max);

  if (index < max) {
    return index;
  }
  console.log('max', index);
  return max - 1;
}

app.whenReady().then(() => {
  createWindow();
  let isWork = true;
  const timer = relaxTimes[isWork ? 0 : 1];
  const job = schedule.scheduleJob(timer, () => {
    if (!isWork) {
      console.log('notify to take break: ', new Date());
      let contentArray = [];
      if (relaxTimes[1].indexOf('/') <= 2) {
        contentArray = content.short;
      } else {
        contentArray = content.long;
      }
      const index = getRandomInt(contentArray.length);
      createNotification(contentArray[index].title, contentArray[index].body);
    }
    isWork = !isWork;
    restartJob(job, isWork);
  });

  powerMonitor.on('suspend', () => {
    console.log('suspended');
    job.cancel();
  });

  powerMonitor.on('resume', () => {
    console.log('resume');
    restartJob(job, true);
  });

  powerMonitor.on('lock-screen', () => {
    console.log('locked');
    job.cancel();
  });

  powerMonitor.on('unlock-screen', () => {
    console.log('unlocked');
    restartJob(job, true);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
