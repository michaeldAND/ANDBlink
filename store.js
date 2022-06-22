const { MongoClient } = require('mongodb');
const {
  app, safeStorage,
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
    // const retrievedData = this.parseDataFile(this.path);
    // this.createCronForFileData(retrievedData);
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

  parseDataFile(filePath) {
    let fileData;
    try {
      fileData = JSON.parse(safeStorage.decryptString(fs.readFileSync(filePath)));
    } catch (error) {
      // if there was some kind of error, resets file to default.
      this.resetToDefault();
      console.log('Caught error:', error);
    }

    return fileData;
  }

  get() {
    return this.data;
  }

  set(value) {
    this.createCronForFileData(value);
    fs.writeFileSync(this.path, safeStorage.encryptString(JSON.stringify(this.data)));
  }

  async fetch() {
    const client = await MongoClient.connect('mongodb://localhost:27017');

    const db = client.db('andBlink');
    const settingsCollection = db.collection('settings');
    const settings = await settingsCollection.find({}).toArray();

    console.log('RESULT', settings);
    this.createCronForFileData(settings);
  }

  resetToDefault() {
    const defaults = [
      { workTime: 3000, breakTime: 600, active: false },
      { workTime: 1200, breakTime: 20, active: true },
      { workTime: 7, breakTime: 3, active: true },
    ];
    this.set(defaults);
  }
}

module.exports = Store;
