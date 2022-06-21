import React, { useState } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Checkbox } from 'semantic-ui-react';
import logo from './logo.svg';

function App() {
  const [scheduleBreaks, setScheduleBreaks] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <Checkbox toggle onClick={() => setScheduleBreaks(scheduleBreaks)}>
          Toggle
        </Checkbox>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
