import { popUpCameraID } from '../popup/popupSlice';
import mapboxgl from 'mapbox-gl';
import styles from './Map.module.css';
import { Camera } from './types';

export function injectMarker(
  map: mapboxgl.Map,
  camera: Camera,
  callback: (popUpInfo: popUpCameraID) => void
) {
  const el = document.createElement('div');
  el.className = styles.marker;
  el.id = camera.name;
  el.style.backgroundImage =
    'url(https://img.icons8.com/material-two-tone/48/000000/apple-camera.png)';
  el.onclick = () => {
    callback(camera.id);
  };

  const marker = new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
    .setLngLat([camera.longitude, camera.latitude])
    .addTo(map);

  return { ...camera, marker: marker };
}
