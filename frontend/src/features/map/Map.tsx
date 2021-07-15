import mapboxgl from 'mapbox-gl';
import React, { useState, useRef, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './mapSlice';
import styles from './Map.module.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjI5ZHloMTBhcjYzb3BlMnVpOG80bmwifQ.eKnvR1lWydBWdG6VX7VEKA';

export function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null | undefined>(null);
  const [lng, setLng] = useState(-2.559826);
  const [lat, setLat] = useState(51.513417);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ==  null ? "" : mapContainer.current,
      style: 'mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div>
      <div ref={mapContainer} className={styles.container} />
    </div>
  );
}
