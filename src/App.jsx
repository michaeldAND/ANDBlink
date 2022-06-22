import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {
  Accordion,
  Checkbox, Grid, GridColumn, Icon, Input, Menu, Segment,
} from 'semantic-ui-react';
import Spacing from './Spacing';

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState({
    workTime: 1000,
    breakTime: 50,
    active: false,
  });
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState({
    workTime: 1200,
    breakTime: 20,
    active: false,
  });
  const [activeItem, setActiveItem] = useState('Manage your screen time');
  const [openScheduleBreaks, setOpenScheduleBreaks] = useState(false);
  const [openEyeStrainBreaks, setOpenEyeStrainBreaks] = useState(false);

  useEffect(() => {
    window.electron.handshake();
    window.electron.recieveSettings((settings) => {
      // TODO: Investigate call occurence
      console.log('SETTINGS', settings);
      setOpenScheduleBreaks(settings[0].active);
      setOpenEyeStrainBreaks(settings[1].active);
      setScheduleBreaks((prev) => ({
        ...prev,

        workTime: settings[0].workTime,
        breakTime: settings[0].breakTime,
        active: settings[0].active,

      }));

      setEyeStrainBreaks((prev) => ({
        ...prev,

        workTime: settings[1].workTime,
        breakTime: settings[1].breakTime,
        active: settings[1].active,
      }));
    });
  }, []);

  useEffect(() => {
    // construct the array]
    console.log('yolo', scheduleBreaks);
    console.log('yolo 2', eyeStrainBreaks);

    window.electron.sendSettings([scheduleBreaks,
      { workTime: 500, breakTime: 20, active: eyeStrainBreaks }]);
  }, [scheduleBreaks, eyeStrainBreaks]);

  const VIEWS = {
    'Manage your screen time':
  <Segment>
    ANDBlink can help you create healthier screen time habits by using our 2 features:
    <Spacing />

    <Grid padded="vertically">
      <GridColumn width={8}>
        <Accordion fluid styled padded="vertically">
          <Accordion.Title active={openScheduleBreaks}>
            <Checkbox
              id="scheduleBreaks"
              toggle
              checked={scheduleBreaks.active}
              onClick={() => setScheduleBreaks((prev) => ({
                ...prev,

                active: !prev.active,

              }))}
              label="Schedule breaks"
            />
            <Icon
              name="cog"
              className="float-right"
              onClick={() => setOpenScheduleBreaks(!openScheduleBreaks)}
            />
          </Accordion.Title>
          <Accordion.Content active={openScheduleBreaks}>
            Schedule breaks throughout the day to rest.
            Get away from the laptop, move around or standup.
            Schedule a break every
            {' '}
            <Input
              type="number"
              onChange={(event) => setScheduleBreaks((prev) => ({
                ...prev,
                workTime: event.target.value,
              }))}
            />
            {' '}
            minutes

            <Spacing />
            The break should last
            {' '}
            <Input type="number" />
            {' '}
            minutes

          </Accordion.Content>
        </Accordion>
        <Spacing />
        <Accordion fluid styled padded="vertically">
          <Accordion.Title active={openEyeStrainBreaks}>
            <Checkbox
              id="reduceEyeStrain"
              toggle
              checked={eyeStrainBreaks.active}
              onClick={() => setEyeStrainBreaks((prev) => ({
                ...prev,

                active: !prev.active,

              }))}
              label="Reduce eye strain"
            />
            <Icon
              name="cog"
              className="float-right"
              onClick={() => setOpenEyeStrainBreaks(!openEyeStrainBreaks)}
            />
          </Accordion.Title>
          <Accordion.Content active={openEyeStrainBreaks}>content</Accordion.Content>
        </Accordion>
      </GridColumn>
    </Grid>
  </Segment>,
    'Daily check-in': <Segment>number 2</Segment>,
  };
  return (
    <>

      <div>
        <Menu attached="top" tabular>
          <Menu.Item
            name="Manage your screen time"
            active={activeItem === 'Manage your screen time'}
            onClick={(e, { name }) => setActiveItem(name)}
          />
          <Menu.Item
            name="Daily check-in"
            active={activeItem === 'Daily check-in'}
            onClick={(e, { name }) => setActiveItem(name)}
          />

        </Menu>

      </div>

      <Grid padded="horizontally vertically" verticalAlign="center">
        <GridColumn width={10} textAlign="left">
          {VIEWS[activeItem]}
        </GridColumn>
      </Grid>
    </>
  );
}

export default App;
