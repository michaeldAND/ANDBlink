/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const {
  app,
} = require('electron');
const path = require('path');
const content = require('./data');

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
  }

  createCronForData(retrievedData) {
    const data = [...retrievedData];
    data.forEach((element, index) => {
      data[index].workCron = createCron(element.workTime).cron;
      const breakData = createCron(element.breakTime);
      data[index].breakCron = breakData.cron;
      data[index].isShort = breakData.isShort;
      data[index].message = breakData.message;
    });
    this.data = data;
  }

  // adds the CRONS into the RAW data and returns it.
  get() {
    this.createCronForData(this.settings);
    return this.data;
  }

  // sets up the database connection
  async setupConnection() {
    this.client = await MongoClient.connect('mongodb://localhost:27017');

    const db = this.client.db('andBlink');
    this.settingsCollection = db.collection('settings');
  }

  // updates the settingsCollection with A new setting.
  async update(value) {
    await this.setupConnection();
    const newValue = { ...value };
    const id = newValue._id;
    delete newValue._id;

    await this.settingsCollection.findOneAndUpdate({ _id: id }, { $set: newValue });
    this.client.close();
  }

  // updates the settingsCollection with A List of setting
  async updateMany(values) {
    await this.setupConnection();
    await this.settingsCollection.deleteMany({});
    await this.settingsCollection.insertMany(values);
    this.client.close();
  }

  // fetches the RAW data without CRON's
  async fetch() {
    await this.setupConnection();

    this.settings = await this.settingsCollection.find({}).toArray();
    this.client.close();
  }

  async resetToDefault() {
    await this.updateMany(content.defaultSettings);
  }
}

module.exports = Store;
