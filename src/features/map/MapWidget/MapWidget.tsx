import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapWidget.module.scss';

export function MapWidget() {
  const position = { lat: 54.9914, lng: 73.3645 };

  return (
    <MapContainer
      className={styles.mapContainer}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Это Омск</Popup>
      </Marker>
    </MapContainer>
  );
}
