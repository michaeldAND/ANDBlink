import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox } from 'semantic-ui-react';

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(0);

  return (

    <Checkbox toggle onClick={() => setScheduleBreaks(scheduleBreaks)}>
      Toggle
    </Checkbox>

  );
}

export default App;
