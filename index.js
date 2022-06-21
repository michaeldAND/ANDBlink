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
const userSettings = contentStore.get();
const tasks = new Array(userSettings.length);

function createNotification(title, body) {
  const breakNotification = new Notification({ title, body });
  breakNotification.show();
}

function scheduleJobs() {
  userSettings.forEach((setting, index) => {
    if (!setting.active) {
      return;
    }
    tasks[index] = { isWork: true, workCron: setting.workCron, breakCron: setting.breakCron };
    console.log('creating scheduled job', index);
    const job = schedule.scheduleJob(setting.workCron, () => {
      if (!tasks[index].isWork) {
        console.log('notify to take break: ', new Date());
        let contentArray = setting.isShort ? content.short : content.long;
        const index = getRandomInt(contentArray.length);
        let title = contentArray[index].title;
        title = title.replace('%REPLACE%', setting.message);
        createNotification(title, contentArray[index].body);
      }
      tasks[index].isWork = !tasks[index].isWork;
      job.reschedule(tasks[index].isWork ? setting.workCron : setting.breakCron)
    });
    tasks[index].job = job;
    console.log('done adding job', index);
  });
}

function cancelJobs() {
  tasks.forEach(task => task.job.cancel());
}

function restartJobs() {
  tasks.forEach((task, index) => { 
    task.job.reschedule(task.workCron);
    tasks[index].isWork = true;
  });
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
  scheduleJobs();

  powerMonitor.on('suspend', () => {
    console.log('suspended');
    cancelJobs();
  });

  powerMonitor.on('resume', () => {
    console.log('resume');
    restartJobs();
  });

  powerMonitor.on('lock-screen', () => {
    console.log('locked');
    cancelJobs();
  });

  powerMonitor.on('unlock-screen', () => {
    console.log('unlocked');
    restartJobs();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
