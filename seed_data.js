use andBlink
db.dropDatabase();

db.settings.insertMany([
      { name: '50-10', workTime: 3000, breakTime: 600, active: false },
      { name: '20-20', workTime: 1200, breakTime: 20, active: true },
      { name: 'test', workTime: 7, breakTime: 3, active: true },
    ],
);
