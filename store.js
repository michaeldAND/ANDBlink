/* eslint-disable no-underscore-dangle */
const {
  app,
} = require('electron');
const path = require('path');
const fs = require('fs');
const data = require('./data');

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
    this.parseDataFile(this.path);
  }

  parseDataFile(filePath) {
    try {
      this.settings = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      // if there was some kind of error, resets file to default.
      this.set(data.defaultSettings);
      console.log('Caught error:', error);
    }
  }

  createCronForData() {
    this.data = [...this.settings];
    this.data.forEach((element, index) => {
      this.data[index].workCron = createCron(element.workTime).cron;
      const breakData = createCron(element.breakTime);
      this.data[index].breakCron = breakData.cron;
      this.data[index].isShort = breakData.isShort;
      this.data[index].message = breakData.message;
    });
  }

  // adds the CRONS into the RAW data and returns it.
  get() {
    this.createCronForData(this.settings);
    return this.data;
  }

  set(value) {
    this.settings = value;
    fs.writeFileSync(this.path, JSON.stringify(value));
  }

  resetToDefaults() {
    this.set(data.defaultSettings);
  }
}

module.exports = Store;
