import { popUpInfo } from '../popup/popupSlice';
import mapboxgl from 'mapbox-gl';
import styles from './Map.module.css';

export function makeMarker(
  map: mapboxgl.Map,
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  numImages: number,
  callback: (popUpInfo: popUpInfo) => void
) {
  const el = document.createElement('div');
  el.className = styles.marker;
  el.id = name;
  el.style.backgroundImage =
    'url(https://img.icons8.com/material-two-tone/48/000000/apple-camera.png)';
  el.onclick = () => {
    callback({
      id: id,
      name: name,
      latitude: latitude,
      longitude: longitude,
      numImages: numImages,
    });
  };

  const marker = new mapboxgl.Marker(el, { offset: [0, -50 / 2] })
    .setLngLat([longitude, latitude])
    .addTo(map);
  return marker;
}
