import mapboxgl from "mapbox-gl";
import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { Pane, Dialog, TextInputField } from "evergreen-ui";

import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { popUpInfo } from "../popup/popupSlice";
import { LoginState } from "../login/loginSlice";

// Todo: Move this to environmen variable.
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

function makeMarker(
  map: mapboxgl.Map,
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  numImages: number,
  callback: (popUpInfo: popUpInfo) => void
) {
  let el = document.createElement("div");
  el.className = styles.marker;
  el.style.backgroundImage =
    "url(https://img.icons8.com/material-two-tone/48/000000/apple-camera.png)";
  el.onclick = () => {
    callback({
      id: id,
      name: name,
      latitude: latitude,
      longitude: longitude,
      numImages: numImages,
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
  name: string;
  longitude: number;
  latitude: number;
  image_count: number;
  marker: mapboxgl.Marker;
}

// This defines the state machine for the Map.
// Viewing is normal mode, AddingCamera means it's waiting for a click to say
// where the new cameras is going to be.
enum MapStates {
  Viewing,
  AddingCamera,
  NamingCamera,
}

interface DialogProps {
  isShown: boolean;
  closeCallback(): void;
  confirmCallback(name: string): void;
}

function EnterCameraName({
  isShown,
  closeCallback,
  confirmCallback,
}: DialogProps) {
  const [name, setName] = useState("");
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Give it a name."
        confirmLabel="Confirm Name"
        onCloseComplete={() => closeCallback()}
        onConfirm={() => {
          confirmCallback(name);
        }}
      >
        <TextInputField
          label="Camera Name"
          required
          value={name}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setName(e.currentTarget.value)
          }
        />
      </Dialog>
    </Pane>
  );
}

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

    // Register AddCamera
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
        deleteCamera(id: number) {
          console.log(id);
          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${login.token}`,
            },
          };
          fetch(`http://localhost:8000/web/cameras/${id}`, requestOptions)
            .then((response) => {
              if (response.ok) {
                setCameras((cameras) => {
                  return cameras.filter((camera: Camera) => {
                    if (camera.id === id) camera.marker.remove();
                    return camera.id !== id;
                  });
                });
              } else {
                throw new Error("Bad response.");
              }
            })
            .catch((error) => console.log(error));
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
          map.current.getCanvas().style.cursor = "crosshair";
        } else {
          map.current.getCanvas().style.cursor = "pointer";
        }
      }
    }, [mapState]);

    // Wipe Cameras on Logout
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

    // Fetch Cameras on Login
    // This effect is triggered by a change in login, specifically it watches for
    // a change in token which is NOT "", in which case it exits early. If the token
    // is not "" then it means a user has logged in, this effect then requests all cameras
    // for that user from the API using the token and updates the Map camera state which
    // results in them all being displayed on the map.
    useEffect(() => {
      // If token is "" just skip, don't hit the API.
      if (login.token === "" || cameras.length > 0) {
        console.log("Skipping fetch, already have cameras.");
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
                      camera.id,
                      camera.name,
                      camera.longitude,
                      camera.latitude,
                      camera.image_count,
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
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${login.token}`,
          },
          body: JSON.stringify({
            name: name,
            longitude: clickCoordinates.longitude,
            latitude: clickCoordinates.latitude,
            user: login.id,
          }),
        };

        fetch("http://localhost:8000/web/cameras/", requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Couldn't post camera.");
            }
          })
          .then((data) => {
            let newCamera = { ...data };
            setCameras((prevCameras) => {
              if (map.current) {
                newCamera.marker = makeMarker(
                  map.current,
                  newCamera.id,
                  newCamera.name,
                  newCamera.longitude,
                  newCamera.latitude,
                  newCamera.image_count,
                  onCameraClick
                );
                return [...prevCameras, newCamera];
              }
              return [...prevCameras];
            });
          })
          .catch((error) => console.log(error));

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
              ? { opacity: 0.5, backgroundColor: "#CCCCCC", cursor: "pointer" }
              : {}
          }
        >
          {children}
          <EnterCameraName
            isShown={mapState === MapStates.NamingCamera}
            closeCallback={handleDialogCancel}
            confirmCallback={handleDialogConfirm}
          />
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
