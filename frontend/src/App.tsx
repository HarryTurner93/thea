import React from "react";

import { Map } from "./features/map/Map";
import { Popup } from "./features/popup/Popup";
import { Button } from "./features/button/Button";
import Login from "./features/login/Login";
import styles from "./App.module.css";
import {useAppSelector} from "./app/hooks";
import {getToken} from "./features/login/loginSlice";

function LoggedInApp() {
  return (
    <div>
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
  )
}

function App() {
  const token = useAppSelector(getToken);

  return (
    <div className="App">
      <header className="App-header">
        <Map>
          {
            token === ""
              ? <Login/>
              : <LoggedInApp/>
            }
        </Map>
      </header>
    </div>
  );
}

export default App;