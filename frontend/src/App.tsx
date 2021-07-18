import React, { useCallback } from "react";

import { Map } from "./features/map/Map";
import { CircleButton } from "./features/circleButton/CircleButton";
import Login from "./features/login/Login";
import styles from "./App.module.css";
import { useAppSelector } from "./app/hooks";
import { getToken } from "./features/login/loginSlice";

function LoggedInApp() {
  const logOutCallback = useCallback(() => {
    console.log("Log out.");
  }, []);

  const addCameraCallback = useCallback(() => {
    console.log("Add camera.");
  }, []);

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.iconBar}>
          <div className={styles.iconContainer}>
            <CircleButton text="＋" callback={addCameraCallback} />
          </div>
          <div className={styles.iconContainer}>
            <CircleButton text="➜" doPopUp={true} callback={logOutCallback} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const token = useAppSelector(getToken);

  return (
    <div className="App">
      <header className="App-header">
        <Map token={token}>{token === "" ? <Login /> : <LoggedInApp />}</Map>
      </header>
    </div>
  );
}

export default App;
