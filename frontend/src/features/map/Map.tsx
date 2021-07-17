import mapboxgl, { Marker } from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";

import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

// Todo: Move this to environmen variable.
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

function makeMarker(
  map: mapboxgl.Map | null | undefined,
  longitude: number,
  latitude: number
) {
  let el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage =
    "url(https://img.icons8.com/material-two-tone/48/000000/apple-camera.png)";
  el.style.width = "48px";
  el.style.height = "48px";
  el.style.backgroundSize = "100%";

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
  token: string;
}

interface Camera {
  id: number;
  longitude: number;
  latitude: number;
}

export function Map({ children, token }: Props) {
  // Map State
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null | undefined>(null);

  const [cameras, setCameras] = useState<Camera[]>([])

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current == null ? "" : mapContainer.current,
      style: "mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq",
      center: [-2.559826, 51.513417],
      zoom: 15,
    });
  });

  // When cameras updates, I want to draw them all, but I don't want to keep adding them
  // so I either have to track the ones already added and delete them, or don't add new ones if
  // they're already there. How can I track them without an infinite loop?
  useEffect(() => {
    console.log(cameras)
  }, [cameras])

  // When the token changes, fetch new cameras from the API and display them.
  useEffect(() => {
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
      .then(data => setCameras(data))
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div ref={mapContainer} className={styles.container}>
      <div className={styles.overlay}>{children}</div>
    </div>
  );
}
