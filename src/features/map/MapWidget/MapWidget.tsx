import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapWidget.module.scss';
import type { MapMarker } from '@/types';
import BlueMarkerIcon from '@/assets/icons/marker-icon-2x-blue.png';
import OrangeMarkerIcon from '@/assets/icons/marker-icon-2x-orange.png';

const defaultIcon = L.icon({
  iconUrl: BlueMarkerIcon,

  iconSize: [25, 41],
});

const activeIcon = L.icon({
  iconUrl: OrangeMarkerIcon,

  iconSize: [25, 41],
});

interface MapWidgetProps {
  markers: MapMarker[];
}

export function MapWidget({ markers }: MapWidgetProps) {
  const position = { lat: 54.9914, lng: 73.3645 };

  return (
    <MapContainer
      className={styles.mapContainer}
      center={position}
      zoom={12}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => {
        const lat = Number(marker.latitude);
        const lng = Number(marker.longitude);

        const array = [defaultIcon, activeIcon];
        const i = Math.round(Math.random());
        const icon = array[i];

        return (
          <Marker icon={icon} key={index} position={{ lat, lng }}>
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              Широта: {lat.toFixed(6)}
              <br />
              Долгота: {lng.toFixed(6)}
            </Popup>
          </Marker>
        );
      })}
      <Marker position={position}>
        <Popup>Это Омск</Popup>
      </Marker>
    </MapContainer>
  );
}
