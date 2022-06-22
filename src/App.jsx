import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(false);
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState(false);

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
    window.electron.sendSettings([{ workTime: 3000, breakTime: 600, active: scheduleBreaks },
      { workTime: 4000, breakTime: 400, active: eyeStrainBreaks }]);
  }, [scheduleBreaks, eyeStrainBreaks]);

  return (
    <>
      <Checkbox toggle checked={scheduleBreaks} onClick={() => setScheduleBreaks(!scheduleBreaks)}>
        Toggle
      </Checkbox>
      <Checkbox
        toggle
        checked={eyeStrainBreaks}
        onClick={() => setEyeStrainBreaks(!eyeStrainBreaks)}
      >
        Toggle
      </Checkbox>
    </>
  );
}

export default App;
