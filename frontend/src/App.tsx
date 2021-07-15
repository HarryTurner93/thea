import React from 'react';
import { Map } from './features/map/Map';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Map>
              <div style={{
                  backgroundColor: '#00FF00',
                  height: '50px',
                  width: '100px',
                  position: 'absolute'
              }}></div>
          </Map>
      </header>
    </div>
  );
}

export default App;
