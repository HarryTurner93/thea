import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import { MAPBOX_ACCESS_TOKEN } from '../../config';

import styles from './Map.module.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import { popUpCameraID } from '../popup/popupSlice';
import { LoginState } from '../login/loginSlice';
import { Camera, MapStates } from './types';
import { NewCameraDialog } from './components/NewCameraDialog';
import { injectMarker } from './utils';
import { deleteCamera, getCameras, postCamera } from './api';

// Setup Mapbox.
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface Props {
  children: JSX.Element;
  onCameraClick: (popUpInfo: popUpCameraID) => void;
  login: LoginState;
}

export const Map = React.forwardRef(({ children, onCameraClick, login }: Props, ref) => {
  // Map State
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null | undefined>(null);

  const [cameras, setCameras] = useState<Camera[]>([]);
  const [clickCoordinates, setClickCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [mapState, setMapState] = useState<MapStates | null>(MapStates.Viewing);

  // Constructor
  useEffect(() => {
    // Initialise map once.
    if (map.current) return;

    // Create the map and link to the div element.
    map.current = new mapboxgl.Map({
      container: mapContainer.current == null ? '' : mapContainer.current,
      style: 'mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq',
      center: [-2.559826, 51.513417],
      zoom: 15,
    });

    // Capture all mouse clicks and log them in component state.
    map.current.on('mousedown', function (e) {
      setClickCoordinates({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
    });
  });

  // Register Externally Callable Functions
  // This registers several functions an externally callable function so other
  // components can "trigger" them by using the Map as a reference. This is how I get
  // other components to trigger changes in MapState. Another way to do it would be to
  // use redux but I couldn't get the redux action creator to make the previous state
  // available inside setState (which I use in another function). Hence I used React
  // state but needed a way for another component to update it.
  useImperativeHandle(
    ref,
    () => ({
      // addCamera triggers the map to move into the add camera state.
      addCamera() {
        setMapState(MapStates.AddingCamera);
      },

      // deleteCamera removes a camera by calling the API and deleting from state.
      deleteCamera(id: number) {
        deleteCamera(login, id).then(() => {
          setCameras((cameras) => {
            return cameras.filter((camera: Camera) => {
              if (camera.id === id && camera.marker) camera.marker.remove();
              return camera.id !== id;
            });
          });
        });
      },
    }),
    [login]
  );

  // Click Map
  // This effect is triggered every time the user clicks, but it checks the mapState and
  // does nothing if the mapState is in Viewing. If it's in the correct state though
  // (AddingCamera) then it moves the state to NamingCamera, at this point, the clickCoordinates
  // are saved in the state.
  useEffect(() => {
    setMapState((prevState) => {
      // Only take action if the map is in the right state.
      if (prevState === MapStates.AddingCamera) {
        return MapStates.NamingCamera;
      }

      // If map was not in the AddingCamera state, then abort with no change.
      return null;
    });
  }, [login, onCameraClick, clickCoordinates]);

  // Update Cursor
  // This effect is triggered by a change in mapState. If the mapState is addingCamera
  // then it changes the map cursor to a crosshair, otherwise it changes it to a cursor.
  useEffect(() => {
    if (map.current) {
      if (mapState === MapStates.AddingCamera) {
        map.current.getCanvas().style.cursor = 'crosshair';
      } else {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    }
  }, [mapState]);

  // Wipe Cameras on Logout
  // This effect is triggered by a change in login, specifically it watches
  // for the case where the login token becomes "" which means the user has logged out.
  // The effect is to remove all cameras from the map.
  useEffect(() => {
    if (login.token === '') {
      setCameras((cameras) => {
        for (const camera of cameras) {
          if (camera.marker) camera.marker.remove();
        }
        return [];
      });
    }
  }, [setCameras, login]);

  // Fetch Cameras on Login
  // This effect is triggered by a change in login, specifically it watches for
  // a change in token which is NOT "", in which case it exits early. If the token
  // is not "" then it means a user has logged in, this effect then requests all cameras
  // for that user from the API using the token and updates the Map camera state which
  // results in them all being displayed on the map.
  useEffect(() => {
    // If token is "" just skip, don't hit the API.
    if (login.token === '' || cameras.length > 0) return;

    // Update array of cameras with any new ones.
    getCameras(login)
      .then((data) =>
        setCameras((existingCameras) => {
          const existingIDs = existingCameras.map((camera) => camera.id);
          const newCameras = data.filter((camera: Camera) => !existingIDs.includes(camera.id));
          const markedCameras = newCameras
            .map((camera: Camera) => {
              if (map.current) {
                return injectMarker(map.current, camera, onCameraClick);
              } else {
                return null;
              }
            })
            .filter((markedCamera: Camera | null) => markedCamera !== null);

          return [...existingCameras, ...markedCameras];
        })
      )

      // Catch errors.
      .catch((error) => console.log(error));
  }, [onCameraClick, login, cameras]);

  // Close Naming Dialog
  // This callback is passed to the dialog that opens when the Map is in NamingCamera state.
  // If the dialog is closed, this moves the state back to Viewing so that the dialog goes
  // away.
  const handleDialogCancel = useCallback(() => {
    setMapState(MapStates.Viewing);
  }, []);

  // Confirm Name Dialog
  // This callback is passed to the dialog that opens when the Map is in NamingCamera state.
  // If the dialog is confirmed with a name then this function finally adds a new camera to
  // the state, and then moves back to Viewing so that the dialog goes away.
  const handleDialogConfirm = useCallback(
    (name: string) => {
      // Try and create camera in backend.
      postCamera(login, name, clickCoordinates.longitude, clickCoordinates.latitude).then(
        (data) => {
          setCameras((prevCameras) => {
            if (map.current) {
              const newCamera = injectMarker(map.current, data, onCameraClick);
              return [...prevCameras, newCamera];
            }
            return [...prevCameras];
          });
        }
      );

      setMapState(MapStates.Viewing);
    },
    [clickCoordinates, login, onCameraClick]
  );

  // Render
  // This is the render function. It renders the map in the div referenced, then it
  // renders an overlay over the top which allows the children to be drawn on top of the map.
  // If the map is in AddingCamera state then it greys out the screen a bit and adds a
  // label in the middle to alert the user to the change in state.
  return (
    <div ref={mapContainer} className={styles.container}>
      <div
        className={styles.overlay}
        style={
          mapState === MapStates.AddingCamera
            ? { opacity: 0.5, backgroundColor: '#CCCCCC', cursor: 'pointer' }
            : {}
        }
      >
        {children}
        <NewCameraDialog
          isShown={mapState === MapStates.NamingCamera}
          closeCallback={handleDialogCancel}
          confirmCallback={handleDialogConfirm}
        />
        {mapState === MapStates.AddingCamera ? (
          <h1 className={styles.addSensorLabel}>Click on the map to add a sensor</h1>
        ) : null}
      </div>
    </div>
  );
});
