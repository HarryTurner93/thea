import React from 'react';
import { Map } from './features/map/Map';
import { Popup } from "./features/popup/Popup";
import styles from './App.module.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Map>
              <div className={styles.mapOverlay}>
                  <div className={styles.headerContainer}>
                      <Popup/>
                      <div className={styles.iconBar}>
                          <div className={styles.iconContainer}></div>
                          <div className={styles.iconContainer}></div>
                      </div>
                  </div>
              </div>
          </Map>
      </header>
    </div>
  );
}

export default App;
