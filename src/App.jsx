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
    workTime: 3000,
    breakTime: 600,
    active: false,
    name: 'scheduleBreaks',
  });
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState({
    workTime: 1200,
    breakTime: 20,
    active: false,
    name: 'eyeStrainBreaks',
  });
  const [activeItem, setActiveItem] = useState('Manage your screen time');
  const [openScheduleBreaks, setOpenScheduleBreaks] = useState(false);
  const [openEyeStrainBreaks, setOpenEyeStrainBreaks] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.electron.handshake();
    window.electron.recieveSettings((settings) => {
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
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      console.log('scheduleBreaks', scheduleBreaks);
      console.log('eyeStrainbreaks', eyeStrainBreaks);

      window.electron.sendSettings([scheduleBreaks,
        eyeStrainBreaks]);
    }
  }, [scheduleBreaks, eyeStrainBreaks]);

  const VIEWS = {
    'Manage your screen time':
  <Segment>
    ANDBlink can help you create healthier screen time habits by using our 2 features:
    <Spacing />

    <Grid padded="vertically">
      <GridColumn width={10}>
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

            <Spacing />
            Schedule a break every
            {' '}
            <Input
              type="number"
              value={Math.floor(scheduleBreaks.workTime / 60)}
              min={0}
              onChange={(event) => setScheduleBreaks((prev) => ({
                ...prev,
                workTime: parseInt(event.target.value * 60, 10),
              }))}
            />
            {' '}
            minutes

            <Spacing />
            The break should last
            {' '}
            <Input
              type="number"
              min={0}
              value={Math.floor(scheduleBreaks.breakTime / 60)}
              onChange={(event) => setScheduleBreaks((prev) => ({
                ...prev,
                breakTime: parseInt(event.target.value * 60, 10),
              }))}
            />
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
          <Accordion.Content active={openEyeStrainBreaks}>
            If youre staring at a screen for a long periods of time,
            looking away for 20 seconds every 20 minutes can help reduce the strain of your eyes.

            <Spacing />

            Remind me to look away every

            {' '}
            <Input
              type="number"
              min={0}
              value={Math.floor(eyeStrainBreaks.workTime / 60)}
              onChange={(event) => setEyeStrainBreaks((prev) => ({
                ...prev,
                workTime: parseInt(event.target.value * 60, 10),
              }))}
            />
            {' '}
            minutes
          </Accordion.Content>
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
