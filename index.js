const {
  app, BrowserWindow, Notification, powerMonitor
} = require('electron');
const schedule = require('node-schedule');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './Logo.png',
  });

  win.loadFile('index.html');
};

const relaxTimes = ['*/3 * * * * *', '*/1 * * * * *'];

// app.whenReady -> 2 x cronstrings [break, work] -> job.schedule(50mins).reschedule(10mins).reschedule(50mins).reschedule(10mins)...

app.whenReady().then(() => {
  createWindow();
  let isWork = true;
  const timer = relaxTimes[isWork ? 0 : 1];
  const job = schedule.scheduleJob(timer, () => {
    if (!isWork) {
      console.log('notify to take break: ', new Date());
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

  createNotification('This is a title', 'This is a body');
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


function createNotification(title, body) {
  const breakNotification = new Notification({ title, body });
  breakNotification.show();
}

function restartJob(job, isWork) {
  const timer = relaxTimes[isWork ? 0 : 1];
  job.reschedule(timer);
}