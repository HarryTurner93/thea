import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Map } from "./features/map/Map";
import { Popup } from "./features/popup/Popup";
import { Button } from "./features/button/Button";
import { Login } from "./features/login/Login";
import styles from "./App.module.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route path="/app">
              <Map>
                <div className={styles.mapOverlay}>
                  <div className={styles.headerContainer}>
                    <Popup />
                    <div className={styles.iconBar}>
                      <div className={styles.iconContainer}>
                        <Button text="＋" />
                      </div>
                      <div className={styles.iconContainer}>
                        <Button text="H" />
                      </div>
                    </div>
                  </div>
                </div>
              </Map>
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
