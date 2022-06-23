# ANDBlink

This application will give a user notifications after a work time period has finished then a break time will start which when finished will restart a new work timer.
The user will have two break patterns to choose from: 
- A schedule breaks pattern where they can pick a work time and break time in minutes 
- A eye strain break pattern that gives a 20 second break after a user defined interval.

The app will have default rules for these breaks the [50-10 rule](https://www.hse.gov.uk/msd/dse/work-routine.htm#:~:text=Take%20short%20breaks%20often%2C%20rather,meetings%20or%20making%20phone%20calls) and the [20-20-20 rule](https://www.sbs.nhs.uk/article/16681/Working-from-home-and-looking-after-your-eyes#:~:text=To%20combat%20this%2C%20we%20would,for%20at%20least%2020%20seconds).

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