import React, { useCallback, useRef } from 'react';

import styles from './App.module.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Browser from './features/browser/Browser';
import { browserInfo, openBrowser } from './features/browser/browserSlice';
import { CircleButton } from './components/Elements/CircleButton/CircleButton';
import Login from './features/login/Login';
import { getLogin, setLogin } from './features/login/loginSlice';
import { Map } from './features/map/Map';
import Popup from './features/popup/Popup';
import { openPopUp, closePopUp, popUpCameraID } from './features/popup/popupSlice';

function App() {
  const login = useAppSelector(getLogin);
  const dispatch = useAppDispatch();

  const mapRef: any = useRef(null);

  // This callback is triggered by the AddCamera CircleButton component and
  // calls the addCamera function inside of Map. It links the two together.
  const onAddCamera = useCallback(() => {
    mapRef.current.addCamera();
  }, []);

  // This callback is triggered by the Delete Camera button on PopUp and
  // calls the deleteCamera function inside of Map. It links the two together.
  const onDeleteCamera = useCallback((id: number) => {
    mapRef.current.deleteCamera(id);
  }, []);

  // This callback is trigered by clicking on a camera icon and is called by the Map
  // which adds onClick handlers to each of the cameras that it displays. This function
  // dispatches an openPopUp action which is handled by the PopUp. These actions contain the
  // info from the clicked on camera for displaying in the PopUp.
  const onCameraClick = useCallback(
    (popUpInfo: popUpCameraID) => {
      dispatch(openPopUp(popUpInfo));
    },
    [dispatch]
  );

  const onOpenBrowser = useCallback(
    (browserInfo: browserInfo) => {
      dispatch(openBrowser(browserInfo));
    },
    [dispatch]
  );

  // This callback is triggered by clicking the Logout CircleButton component and calls
  // logs the user out by setting the token to "". It also closes the popUp incase it was open.
  // The map is alerted when the token changes to "" and wipes all sensors off it as well.
  const handleLogOut = useCallback(() => {
    dispatch(setLogin({ token: '', id: 0 }));
    dispatch(closePopUp());
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <Map onCameraClick={onCameraClick} login={login} ref={mapRef}>
          {login.token === '' ? (
            <Login />
          ) : (
            <div className={styles.headerContainer}>
              <div className={styles.headerContainerFloatLeft}>
                <Browser login={login} />
                <Popup
                  onDeleteCamera={onDeleteCamera}
                  onOpenBrowser={onOpenBrowser}
                  login={login}
                />
              </div>
              <div className={styles.iconBar}>
                <div className={styles.iconContainer}>
                  <CircleButton text="＋" callback={onAddCamera} />
                </div>
                <div className={styles.iconContainer}>
                  <CircleButton
                    text="➜"
                    dialog={true}
                    callback={handleLogOut}
                    dialogTitle="Confirm"
                    dialogBody="Are you sure you want to log out?"
                    dialogButton="Log out"
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
