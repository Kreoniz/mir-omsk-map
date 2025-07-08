import { useEffect, useRef } from 'react';
import { useMap, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface RecenterProps {
  marker: MapMarker;
}

function Recenter({ marker }: RecenterProps) {
  const map = useMap();
  useEffect(() => {
    if (!marker) return;
    map.panTo([marker.latitude, marker.longitude], { animate: true, duration: 0.5 });
  }, [marker, map]);
  return null;
}

interface MapWidgetProps {
  markers: MapMarker[];
  selectedMarkers: Set<string>;
  onMarkerToggle: (name: string) => void;
  lastToggled?: string;
}

export function MapWidget({
  markers,
  selectedMarkers,
  onMarkerToggle,
  lastToggled,
}: MapWidgetProps) {
  const position = { lat: 54.9914, lng: 73.3645 }; // Координаты Омска

  const markerRefs = useRef<Record<string, L.Marker>>({});

  const active =
    lastToggled && selectedMarkers.has(lastToggled)
      ? markers.find((m) => m.name === lastToggled)
      : undefined;

  useEffect(() => {
    markers.forEach((marker) => {
      const ref = markerRefs.current[marker.name];
      if (ref) {
        if (selectedMarkers.has(marker.name)) {
          ref.openPopup();
        } else {
          ref.closePopup();
        }
      }
    });
  }, [selectedMarkers, markers]);

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
      {markers.map((marker) => {
        const lat = marker.latitude;
        const lng = marker.longitude;

        let icon = defaultIcon;

        if (selectedMarkers.has(marker.name)) {
          icon = activeIcon;
        }

        return (
          <Marker
            icon={icon}
            key={marker.name}
            position={{ lat, lng }}
            eventHandlers={{
              click: () => {
                onMarkerToggle(marker.name);
              },
            }}
            ref={(el) => {
              if (el) markerRefs.current[marker.name] = el;
            }}
          >
            <Popup
              autoPan={false}
              autoClose={false}
              closeOnEscapeKey={false}
              closeOnClick={false}
              closeButton={false}
            >
              <strong>{marker.name}</strong>
              <br />
              Широта: {lat.toFixed(6)}
              <br />
              Долгота: {lng.toFixed(6)}
            </Popup>
          </Marker>
        );
      })}

      {active && <Recenter marker={active} />}
    </MapContainer>
  );
}
