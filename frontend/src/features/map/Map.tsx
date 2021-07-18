import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";

import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { popUpInfo } from "../popup/popupSlice";

// Todo: Move this to environmen variable.
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

function makeMarker(
  map: mapboxgl.Map | null | undefined,
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

  if (map != null) {
    let marker = new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
      .setLngLat([longitude, latitude])
      .addTo(map);
    return marker;
  } else {
    return null;
  }
}

interface Props {
  children: JSX.Element;
  onCameraClick: (popUpInfo: popUpInfo) => void;
  token: string;
}

interface Camera {
  id: number;
  longitude: number;
  latitude: number;
  marker: mapboxgl.Marker;
}

export function Map({ children, onCameraClick, token }: Props) {
  // Map State
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null | undefined>(null);

  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current == null ? "" : mapContainer.current,
      style: "mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq",
      center: [-2.559826, 51.513417],
      zoom: 15,
    });
  });

  // If token is "" then user is logged out so remove all markers that exist.
  useEffect(() => {
    if (token === "") {
      setCameras((cameras) => {
        for (const camera of cameras) {
          camera.marker.remove();
        }
        return [];
      });
    }
  }, [setCameras, token]);

  // When the token changes, fetch new cameras from the API and display them.
  useEffect(() => {
    // If token is "" just skip, don't hit the API.
    if (token === "") {
      return;
    }

    const options = {
      headers: new Headers({ Authorization: `Token ${token}` }),
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
          const markedCameras = newCameras.map((camera: Camera) => {
            return {
              ...camera,
              marker: makeMarker(
                map.current,
                camera.longitude,
                camera.latitude,
                onCameraClick
              ),
            };
          });
          return [...existingCameras, ...markedCameras];
        })
      )

      // Catch errors.
      .catch((error) => console.log(error));
  }, [onCameraClick, token]);

  return (
    <div ref={mapContainer} className={styles.container}>
      <div className={styles.overlay}>{children}</div>
    </div>
  );
}
