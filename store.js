const {
  app,
} = require('electron');
const path = require('path');
const fs = require('fs');

function createCron(time) {
  const cron = ['*', '*', '*', '*', '*', '*'];
  let hours;
  let mins;
  let secs = time;
  let isShort = false;

  // timer is passed in seconds, break down to minutes and hours
  if (time > 60) {
    mins = Math.floor(time / 60);
    secs = time % 60;
    if (mins > 60) {
      hours = Math.floor(mins / 60);
      mins %= 60;
    }
  } else {
    isShort = true;
  }

  // formulate a display message for the actual time for the user to see
  const message = [];
  if (hours > 0) {
    cron[2] = `*/${hours}`;
    message.push(`${hours} hrs`);
  }

  if (mins > 0) {
    cron[1] = `*/${mins}`;
    message.push(`${mins} mins`);
  }

  if (secs > 0) {
    cron[0] = `*/${secs}`;
    message.push(`${secs} secs`);
  }

  return { cron: cron.join(' '), isShort, message: message.join(', ') };
}

class Store {
  constructor() {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, 'settings.json');
    const defaults = [
      { workTime: 3000, breakTime: 600, active: false },
      { workTime: 1200, breakTime: 20, active: true },
      { workTime: 7, breakTime: 3, active: true },
    ];
    const retrievedData = this.parseDataFile(this.path, defaults);
    this.createCronForFileData(retrievedData);
  }

  createCronForFileData(retrievedData) {
    const fileData = retrievedData;
    fileData.forEach((element, index) => {
      fileData[index].workCron = createCron(element.workTime).cron;
      const breakData = createCron(element.breakTime);
      fileData[index].breakCron = breakData.cron;
      fileData[index].isShort = breakData.isShort;
      fileData[index].message = breakData.message;
    });
    this.data = fileData;
  }

  parseDataFile(filePath, defaults) {
    let fileData = defaults;
    try {
      fileData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      // if there was some kind of error, resets file to default.
      this.set(defaults);
      console.log('Caught error:', error);
    }

    return fileData;
  }

  get() {
    return this.data;
  }

  set(value) {
    this.createCronForFileData(value);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = Store;
