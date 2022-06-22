import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(false);
  const [eyeStrainBreaks, setEyeStrainBreaks] = useState(false);

  useEffect(() => {
    window.electron.sendSettings(3000, 600, true);
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
