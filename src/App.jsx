import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox, Accordion } from 'semantic-ui-react';

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(0);

  const scheduleBreakPanel = [
    {
      title: 'Schedule break',
      content: [
        'Schedule Break content',
      ],
    },
  ];

  return (

    <>
      <Checkbox toggle onClick={() => setScheduleBreaks(scheduleBreaks)}>
        Toggle
      </Checkbox>
      <Accordion>
        <Accordion fluid styled defaultActiveIndex={0} panels={scheduleBreakPanel} />
      </Accordion>
    </>
  );
}

export default App;
