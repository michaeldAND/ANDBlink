import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(false);
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState(false);

  useEffect(() => {
    console.log('schedule break', scheduleBreaks);
    console.log('eye strains break', eyeStrainBreaks);

    // ipcRenderer.send('yolo', JSON.stringify({ scheduleBreaks, eyeStrainBreaks }));
    window.electron.doThing();
  }, [scheduleBreaks, eyeStrainBreaks]);

  return (
    <>
      <Checkbox toggle onClick={() => setScheduleBreaks(!scheduleBreaks)}>
        Toggle
      </Checkbox>
      <Checkbox toggle onClick={() => setEyeStrainBreaks(!eyeStrainBreaks)}>
        Toggle
      </Checkbox>
    </>
  );
}

export default App;
