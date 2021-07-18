import React, { useCallback } from "react";

import { Map } from "./features/map/Map";
import { CircleButton } from "./features/circleButton/CircleButton";
import Login from "./features/login/Login";
import styles from "./App.module.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getToken, setToken } from "./features/login/loginSlice";
import { openPopUp, closePopUp, popUpInfo } from "./features/popup/popupSlice";
import Popup from "./features/popup/Popup";

function App() {
  const token = useAppSelector(getToken);
  const dispatch = useAppDispatch();

  const addCameraCallback = useCallback(() => {
    console.log("Add camera.");
  }, []);

  const handleCameraClick = useCallback(
    (popUpInfo: popUpInfo) => {
      dispatch(openPopUp(popUpInfo));
    },
    [dispatch]
  );

  const handleLogOut = useCallback(() => {
    dispatch(setToken(""));
    dispatch(closePopUp());
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <Map onCameraClick={handleCameraClick} token={token}>
          {token === "" ? (
            <Login />
          ) : (
            <div className={styles.headerContainer}>
              <Popup />
              <div className={styles.iconBar}>
                <div className={styles.iconContainer}>
                  <CircleButton text="＋" callback={addCameraCallback} />
                </div>
                <div className={styles.iconContainer}>
                  <CircleButton
                    text="➜"
                    doPopUp={true}
                    callback={handleLogOut}
                  />
                </div>
              </div>
            </div>
          )}
        </Map>
      </header>
    </div>
  );
}

export default App;
