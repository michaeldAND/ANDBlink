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

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
};

// create the content store and request data, from file or from defaults
const contentStore = new Store();
const userSettings = contentStore.get();
const tasks = new Array(userSettings.length);

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
    tasks[index] = { isWork: true, workCron: setting.workCron, breakCron: setting.breakCron };
    console.log('creating scheduled job', index);
    const job = schedule.scheduleJob(setting.workCron, () => {
      if (!tasks[index].isWork) {
        console.log('notify to take break', new Date());
        // depending on the break size, show different messages
        const contentArray = setting.isShort ? content.short : content.long;
        const random = getRandomInt(contentArray.length);
        // replace title string with appropriate break time period
        let { title } = contentArray[random];
        title = title.replace('%REPLACE%', setting.message);
        createNotification(title, contentArray[random].body);
      }
      // assign the rescheduling of the job to always alternate between work and break
      tasks[index].isWork = !tasks[index].isWork;
      job.reschedule(tasks[index].isWork ? setting.workCron : setting.breakCron);
    });
    tasks[index].job = job;
  });
}

// cancels all active jobs
function cancelJobs() {
  tasks.forEach((task) => task.job.cancel());
}

// restarts all cancelled job, as the user just took their break
function restartJobs() {
  tasks.forEach((task, index) => {
    task.job.reschedule(task.workCron);
    tasks[index].isWork = true;
  });
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
