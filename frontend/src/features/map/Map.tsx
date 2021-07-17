import mapboxgl from "mapbox-gl";
import React, {useRef, useEffect, useCallback} from "react";

import styles from "./Map.module.css";
import {useAppSelector} from "../../app/hooks";
import {selectCount} from "../counter/counterSlice";

// Todo: Move this to environmen variable.
mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

interface Props {
  children: JSX.Element;
  token: string;
}

export function Map({children, token}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null | undefined>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current == null ? "" : mapContainer.current,
      style: "mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq",
      center: [-2.559826, 51.513417],
      zoom: 12,
    });
  });

  // When the token changes, fetch cameras from the API.
  const handleTokenChange = useEffect(() => {

    const options = {
        headers: new Headers({'Authorization': `Token ${token}`})
    };
    fetch('http://localhost:8000/web/cameras/', options)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Bad response.");
        }
      })

      // Unpack data and update map.
      .then(data => {
        console.log(data)
      })

      // Catch errors.
      .catch((error) => {
        console.log(error)
      })
  }, [token]);

  return (
    <div ref={mapContainer} className={styles.container}>
      <div className={styles.overlay}>
        {children}
      </div>
    </div>
  );
}
