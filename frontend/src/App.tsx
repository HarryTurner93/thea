import React, { useCallback, useRef } from "react";

import { Map } from "./features/map/Map";
import { CircleButton } from "./features/circleButton/CircleButton";
import Login from "./features/login/Login";
import styles from "./App.module.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getLogin, setLogin } from "./features/login/loginSlice";
import { openPopUp, closePopUp, popUpInfo } from "./features/popup/popupSlice";
import Popup from "./features/popup/Popup";

function App() {
  const login = useAppSelector(getLogin);
  const dispatch = useAppDispatch();

  const mapRef: any = useRef(null);

  // This callback is triggered by the AddCamera CircleButton component and
  // calls the addCamera function inside of Map. It links the two together.
  const addCameraCallback = useCallback(() => {
    mapRef.current.addCamera();
  }, []);

  // This callback is trigered by clicking on a camera icon and is called by the Map
  // which adds onClick handlers to each of the cameras that it displays. This function
  // dispatches an openPopUp action which is handled by the PopUp. These actions contain the
  // info from the clicked on camera for displaying in the PopUp.
  const handleCameraClick = useCallback(
    (popUpInfo: popUpInfo) => {
      dispatch(openPopUp(popUpInfo));
    },
    [dispatch]
  );

  // This callback is triggered by clicking the Logout CircleButton component and calls
  // logs the user out by setting the token to "". It also closes the popUp incase it was open.
  // The map is alerted when the token changes to "" and wipes all sensors off it as well.
  const handleLogOut = useCallback(() => {
    dispatch(setLogin({ token: "", id: 0 }));
    dispatch(closePopUp());
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <Map onCameraClick={handleCameraClick} login={login} ref={mapRef}>
          {login.token === "" ? (
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
