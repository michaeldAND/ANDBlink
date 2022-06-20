const {
  app, BrowserWindow, Notification,
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

function createNotification(title, body) {
  const breakNotification = new Notification({ title, body });
  breakNotification.show();
}

// app.whenReady -> 2 x cronstrings [break, work] -> job.schedule(50mins).reschedule(10mins).reschedule(50mins).reschedule(10mins)...

app.whenReady().then(() => {
  createWindow();
  const cronString = '*/3 * * * * *';
  const job = schedule.scheduleJob(cronString, () => {
    console.log('yolo: ', new Date());
  });

  setTimeout(() => {
    console.log('un-yolo');
    job.reschedule(cronString);
  }, 9000);

  createNotification('This is a title', 'This is a body');
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
