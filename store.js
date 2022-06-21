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

  if (time > 60) {
    mins = Math.floor(time / 60);
    secs = time % 60;
    if (mins > 60) {
      hours = Math.floor(mins / 60);
      mins %= 60;
    }
  }

  cron[0] = secs > 0 ? `*/${secs}` : '*';
  cron[1] = mins > 0 ? `*/${mins}` : '*';
  cron[2] = hours > 0 ? `*/${hours}` : '*';

  return cron.join(' ');
}

class Store {
  constructor() {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, 'settings.json');
    const defaults = [
      { workTime: 3000, breakTime: 600, active: true },
      { workTime: 1200, breakTime: 20, active: false },
    ];
    this.data = this.parseDataFile(this.path, defaults);
  }

  parseDataFile(filePath, defaults) {
    let fileData = defaults;
    try {
      fileData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      // if there was some kind of error, resets file to default.
      this.set(defaults);
      console.log(error);
    }
    fileData.forEach((element, index) => {
      fileData[index].workCron = createCron(element.workTime);
      fileData[index].breakCron = createCron(element.breakTime);
    });

    return fileData;
  }

  get() {
    return this.data;
  }

  set(value) {
    this.data = value;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = Store;
