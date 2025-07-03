import { useState, useEffect } from 'react';
import { MapWidget } from '@/features/map';
import styles from './MapPage.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';
import Papa from 'papaparse';
import type { MapMarker } from '@/types';

export function MapPage() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('data/omsk-locations.csv');
      const data = await response.text();

      const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
      setMarkers(parsed.data as MapMarker[]);
    };

    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInfo}>
            <div>
              <MapIcon width="1.5rem" />
              <h2>Объекты</h2>
              {}
            </div>

            <LoadFileIcon width="1.5rem" />
          </div>

          <div className={styles.sidebarContent}>
            <div className={styles.search}>Поиск</div>

            {markers.map((marker, i) => (
              <div key={i} className={styles.accordion}>
                {marker.name}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <main className={styles.main}>
        <MapWidget markers={markers} />
      </main>
    </div>
  );
}
