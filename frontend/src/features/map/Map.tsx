import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect } from "react";

import styles from "./Map.module.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA";

interface Props {
  children: JSX.Element;
}

export function Map(props: Props) {
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

  return (
    <div ref={mapContainer} className={styles.container}>
      <div className={styles.overlay}>
        {props.children}
      </div>
    </div>
  );
}
