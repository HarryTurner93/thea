import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";

import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { popUpInfo } from "../popup/popupSlice";
import { LoginState } from "../login/loginSlice";

// Todo: Move this to environmen variable.
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

function makeMarker(
  map: mapboxgl.Map,
  longitude: number,
  latitude: number,
  callback: (popUpInfo: popUpInfo) => void
) {
  let el = document.createElement("div");
  el.className = styles.marker;
  el.style.backgroundImage =
    "url(https://img.icons8.com/material-two-tone/48/000000/apple-camera.png)";
  el.onclick = () => {
    callback({
      latitude: latitude,
      longitude: longitude,
      numImages: 0,
    });
  };

  let marker = new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
    .setLngLat([longitude, latitude])
    .addTo(map);
  return marker;
}

interface Props {
  children: JSX.Element;
  onCameraClick: (popUpInfo: popUpInfo) => void;
  login: LoginState;
}

interface Camera {
  id: number;
  longitude: number;
  latitude: number;
  marker: mapboxgl.Marker;
}

// This defines the state machine for the Map.
// Viewing is normal mode, AddingCamera means it's waiting for a click to say
// where the new cameras is going to be.
enum MapStates {
  Viewing,
  AddingCamera,
}

// This function is called at the point at which a new camera is added to the Map state.
// It intercepts (well passes through really), and updates the API with the new camera.
// This isn't great because it introduces a short delay, optimistic rendering would be
// better, but at least if the call fails, the camera doesn't get added to the array.
const addCameraMiddleware = (
  cameras: Camera[],
  newCamera: Camera,
  login: LoginState
): Camera[] => {
  let updatedCameras = [...cameras];

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${login.token}`,
    },
    body: JSON.stringify({
      latitude: newCamera.latitude,
      longitude: newCamera.longitude,
      user: login.id,
    }),
  };
  // Todo: Move this to environment variable.
  fetch("http://localhost:8000/web/cameras/", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Couldn't post camera.");
      }
    })
    .then((data) => {
      updatedCameras.push(newCamera);
    })
    .catch((error) => console.log(error));

  return updatedCameras;
};

export const Map = React.forwardRef(
  ({ children, onCameraClick, login }: Props, ref) => {
    // Map State
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null | undefined>(null);

    const [cameras, setCameras] = useState<Camera[]>([]);
    const [clickCoordinates, setClickCoordinates] = useState({
      latitude: 0,
      longitude: 0,
    });
    const [mapState, setMapState] = useState<MapStates | null>(
      MapStates.Viewing
    );

    // Constructor
    useEffect(() => {
      // Initialise map once.
      if (map.current) return;

      // Create the map and link to the div element.
      map.current = new mapboxgl.Map({
        container: mapContainer.current == null ? "" : mapContainer.current,
        style: "mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq",
        center: [-2.559826, 51.513417],
        zoom: 15,
      });

      // Capture all mouse clicks and log them in component state.
      map.current.on("mousedown", function (e) {
        setClickCoordinates({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      });
    });

    // This registers the addCamera as an externally callable function so other
    // components can "trigger" it by using the Map as a reference. This is how I get
    // other components to trigger changes in MapState. Another way to do it would be to
    // use redux but I couldn't get the redux action creator to make the previous state
    // available inside setState (which I use in another function). Hence I used React
    // state but needed a way for another component to update it.
    useImperativeHandle(
      ref,
      () => ({
        // Add camera changes the cursor and moves the state machine to AddingCamera state.
        addCamera() {
          setMapState(MapStates.AddingCamera);
        },
      }),
      []
    );

    // Add Camera
    // This effect is triggered every time the user clicks, but it checks the mapState and
    // does nothing if the mapState is in Viewing. If it's not though, then is adds a new camera
    // to the cameras state and then updates the backend.
    useEffect(() => {
      setMapState((prevState) => {
        // Only take action if the map is in the right state.
        if (prevState === MapStates.AddingCamera) {
          setCameras((prevCameras) => {
            if (map.current) {
              const newCamera: Camera = {
                id: 10,
                latitude: clickCoordinates.latitude,
                longitude: clickCoordinates.longitude,
                marker: makeMarker(
                  map.current,
                  clickCoordinates.longitude,
                  clickCoordinates.latitude,
                  onCameraClick
                ),
              };
              return addCameraMiddleware([...prevCameras], newCamera, login);
            }
            return [...prevCameras];
          });
        }

        // If map was in the viewing state, then just return with no change.
        // Returning null means a rerender is not triggered.
        return null;
      });
    }, [login, onCameraClick, clickCoordinates]);

    // Update Cursor
    // This effect is triggered by a change in mapState. If the mapState is addingCamera
    // then it changes the map cursor to a crosshair, otherwise it changes it to a cursor.
    useEffect(() => {
      if (map.current) {
        if (mapState === MapStates.AddingCamera) {
          map.current.getCanvas().style.cursor = "crosshair";
        } else {
          map.current.getCanvas().style.cursor = "pointer";
        }
      }
    }, [mapState]);

    // This effect is triggered by a change in login, specifically it watches
    // for the case where the login token becomes "" which means the user has logged out.
    // The effect is to remove all cameras from the map.
    useEffect(() => {
      if (login.token === "") {
        setCameras((cameras) => {
          for (const camera of cameras) {
            camera.marker.remove();
          }
          return [];
        });
      }
    }, [setCameras, login]);

    // This effect is triggered by a change in login, specifically it watches for
    // a change in token which is NOT "", in which case it exits early. If the token
    // is not "" then it means a user has logged in, this effect then requests all cameras
    // for that user from the API using the token and updates the Map camera state which
    // results in them all being displayed on the map.
    useEffect(() => {
      // If token is "" just skip, don't hit the API.
      if (login.token === "") {
        return;
      }

      const options = {
        headers: new Headers({ Authorization: `Token ${login.token}` }),
      };
      fetch("http://localhost:8000/web/cameras/", options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Bad response.");
          }
        })

        // Update array of cameras with any new ones.
        .then((data) =>
          setCameras((existingCameras) => {
            const existingIDs = existingCameras.map((camera) => camera.id);
            const newCameras = data.filter(
              (camera: Camera) => !existingIDs.includes(camera.id)
            );
            const markedCameras = newCameras
              .map((camera: Camera) => {
                if (map.current) {
                  return {
                    ...camera,
                    marker: makeMarker(
                      map.current,
                      camera.longitude,
                      camera.latitude,
                      onCameraClick
                    ),
                  };
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
    }, [onCameraClick, login]);

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
              ? { opacity: 0.5, backgroundColor: "#CCCCCC", cursor: "pointer" }
              : {}
          }
        >
          {children}
          {mapState === MapStates.AddingCamera ? (
            <h1 className={styles.addSensorLabel}>
              Click on the map to add a sensor
            </h1>
          ) : null}
        </div>
      </div>
    );
  }
);
