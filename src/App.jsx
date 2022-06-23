import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {
  Checkbox, GridColumn, Grid, Icon, Menu, Segment, Image, Container, Accordion, Input, Button,
} from 'semantic-ui-react';
import happyFace from './happy_face.png';
import neutralFace from './neutral_face.png';
import sadFace from './sad_face.png';
import settingsLogo from './settingsLogo.png';
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
  const [loading, setLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState();

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
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('scheduleBreaks', scheduleBreaks);
      console.log('eyeStrainbreaks', eyeStrainBreaks);

      window.electron.sendSettings([scheduleBreaks,
        eyeStrainBreaks]);
    }
  }, [scheduleBreaks, eyeStrainBreaks]);

  const MOODS = {
    'Happy Face':
  <Container>
    You’re feeling good! Keep spirits high by;
    <ul>
      <li>
        Giving yourself regular breaks
      </li>
      <li>
        Taking a daily walk
      </li>
      <li>
        Chatting with friends
      </li>
      <li>
        Get outside
      </li>
    </ul>
  </Container>,
    'Neutral Face':
  <Container>
    If you’re feeling unsure there a few things you can do to help you feel calmer;
    <ul>
      <li>
        Focus on relaxing
      </li>
      <li>
        Get outdoors and take a walk
      </li>
      <li>
        Listen to your favourite playlist
      </li>
    </ul>
  </Container>,
    'Sad Face':
  <Container>
    If you’re feeling down, take some time to yourself to help gather your thoughts;
    <ul>
      <li>
        Take a step back
      </li>
      <li>
        Focus on relaxing
      </li>
      <li>
        Rest and re-charge
      </li>
      <li>
        Reach out for support
      </li>
      <li>
        Access our support tools
      </li>
    </ul>
  </Container>,
  };

  const VIEWS = {
    'Manage your screen time':
  <Segment>
    ANDBlink can help you create healthier screen time habits by using our 2 features:
    <Spacing />

    <Grid padded="vertically">
      <GridColumn width={4}>
        <Image src={settingsLogo} />
      </GridColumn>
      <GridColumn width={10}>
        <Accordion fluid styled padded="vertically">
          <Accordion.Title active={openScheduleBreaks} style={{ cursor: 'default' }}>
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
              style={{ width: '5rem' }}
              type="number"
              value={Math.floor(scheduleBreaks.workTime / 60)}
              min={1}
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
              style={{ width: '5rem' }}
              type="number"
              min={1}
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
          <Accordion.Title active={openEyeStrainBreaks} style={{ cursor: 'default' }}>
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
            If you are staring at a screen for a long periods of time,
            looking away for 20 seconds every 20 minutes can help reduce the strain of your eyes.

            <Spacing />

            Remind me to look away every

            {' '}
            <Input
              style={{ width: '5rem' }}
              type="number"
              min={1}
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
        <Spacing />
        <Button floated="right" onClick={() => window.electron.restoreDefaults()}>Restore settings</Button>
      </GridColumn>
    </Grid>

  </Segment>,
    'Daily check-in':
  <Segment>
    <Grid>
      <GridColumn width={4}>
        <Image src={settingsLogo} />
      </GridColumn>
      <GridColumn width={12}>
        <p>
          It&apos;s important to check-in daily to understand how you&apos;re feeling
          and how you can shift your day to suit your needs.
        </p>
        <p>How are you feeling today?</p>
      </GridColumn>
    </Grid>

    <Grid>
      <GridColumn width={4}>
        <Spacing />
      </GridColumn>
      <GridColumn width={2}>
        <Image className="wellbeing-indicator" src={happyFace} onClick={() => setCurrentMood('Happy Face')} />
      </GridColumn>
      <GridColumn width={2}>
        <Image className="wellbeing-indicator" src={neutralFace} onClick={() => setCurrentMood('Neutral Face')} />
      </GridColumn>
      <GridColumn width={2}>
        <Image className="wellbeing-indicator" src={sadFace} onClick={() => setCurrentMood('Sad Face')} />
      </GridColumn>
    </Grid>
    <Grid>
      <GridColumn width={4}>
        <Spacing />
      </GridColumn>
      <GridColumn width={12}>
        {MOODS[currentMood]}
      </GridColumn>
    </Grid>
    <Spacing />
  </Segment>,

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
