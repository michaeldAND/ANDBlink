# ANDBlink

This application will give a user notifications after a work time period has finished then a break time will start which when finished will restart a new work timer.
The user will have two break patterns to choose from: 
- A schedule breaks pattern where they can pick a work time and break time in minutes 
- A eye strain break pattern that gives a 20 second break after a user defined interval.

The app will have default rules for these breaks the fifty ten rule and the twenty twenty rule.

## To run locally:

You will need to have Mongodb running locally see [MongoDB docs](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) for more information.
Or use:
```
brew install mongodb-community@5.0
```

Then run:
```
npm install

npm run seeds

npm run start-react

npm run start:nodemon
```

Allow notifications in settings from electron.
![Settings for Electron](/assets/settingsElectron.png)


## To build:
```
npm run build
```

Allow notifications in settings from ANDBlink.
![Settings for ANDBlink](/assets/settingsANDBlink.png)