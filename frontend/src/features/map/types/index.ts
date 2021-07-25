import mapboxgl from 'mapbox-gl';

export type Camera = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  image_count: number;
  marker: mapboxgl.Marker;
};

// This defines the state machine for the Map.
// Viewing is normal mode, AddingCamera means it's waiting for a click to say
// where the new cameras is going to be.
export enum MapStates {
  Viewing,
  AddingCamera,
  NamingCamera,
}
