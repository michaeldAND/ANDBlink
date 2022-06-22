import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {
  Checkbox, Icon, Menu, Segment,
} from 'semantic-ui-react';

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(false);
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState(false);
  const [activeItem, setActiveItem] = useState('Manage your screen time');

  useEffect(() => {
    window.electron.handshake();
    window.electron.recieveSettings((settings) => {
      // TODO: Investigate call occurence
      console.log(settings);
      setScheduleBreaks(settings[0].active);
      setEyeStrainBreaks(settings[1].active);
    });
  }, []);

  useEffect(() => {
    // construct the array
    window.electron.sendSettings([{ workTime: 1000, breakTime: 50, active: scheduleBreaks },
      { workTime: 500, breakTime: 20, active: eyeStrainBreaks }]);
  }, [scheduleBreaks, eyeStrainBreaks]);

  const VIEWS = {
    'Manage your screen time':
  <Segment>
    ANDBlink can help you create healthier screen time habits by using our 2 features:
    <Segment clearing>
      <Checkbox
        id="scheduleBreaks"
        toggle
        checked={scheduleBreaks}
        onClick={() => setScheduleBreaks(!scheduleBreaks)}
        label="Schedule breaks"
      />
      <Icon
        name="cog"
        className="float-right"
      />

    </Segment>
    <Segment clearing>
      <Checkbox
        id="reduceEyeStrain"
        toggle
        checked={eyeStrainBreaks}
        // TODO: Change to use pop up
        onClick={() => setEyeStrainBreaks(!eyeStrainBreaks)}
        label="Reduce eye strain"
      />
      <Icon
        name="cog"
        className="float-right"
        // TODO: Change to use pop up
        onClick={() => setEyeStrainBreaks(!eyeStrainBreaks)}
      />
    </Segment>
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

      {VIEWS[activeItem]}
    </>
  );
}

export default App;
