import React, { useState, useEffect } from 'react';
import { MapWidget } from '@/features/map';
import styles from './MapPage.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';
import SearchIcon from '@/assets/icons/search.svg?react';
import Papa from 'papaparse';
import type { MapMarker } from '@/types';
import { useDebounce } from '@/hooks';
import { Accordion } from '@/components';

export function MapPage() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [searchedMarkers, setSearchedMarkers] = useState<MapMarker[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());

  const search = (query: string) => {
    const processedQuery = query.trim().toLowerCase();

    setSearchedMarkers(
      markers.filter((marker) => {
        const processedMarker = marker.name.trim().toLowerCase();
        return processedMarker.includes(processedQuery);
      })
    );
  };

  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.currentTarget.value);
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('data/omsk-locations.csv');
      const data = await response.text();

      const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
      setMarkers(parsed.data as MapMarker[]);
      setSearchedMarkers(parsed.data as MapMarker[]);
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
            </div>

            <LoadFileIcon width="1.5rem" />
          </div>

          <div className={styles.sidebarContent}>
            <label className={styles.search} htmlFor="searchInput">
              <input
                id="searchInput"
                placeholder="Поиск..."
                onChange={handleSearch}
                type="search"
              />
              <SearchIcon />
            </label>

            <div className={styles.accordions}>
              {searchedMarkers.map((marker) => (
                <Accordion
                  key={marker.name}
                  title={marker.name}
                  onOpen={() => {
                    const updated = new Set(selectedMarkers);
                    updated.add(marker.name);
                    setSelectedMarkers(updated);
                  }}
                  onClose={() => {
                    const updated = new Set(selectedMarkers);
                    updated.delete(marker.name);
                    setSelectedMarkers(updated);
                  }}
                >
                  <div className={styles.accordionContent}>
                    <div>Широта: {marker.latitude}</div>
                    <div>Долгота: {marker.longitude}</div>
                    <div>
                      Описание:{' '}
                      {marker.description || (
                        <span className={styles.descriptionMissing}>Описания нет</span>
                      )}
                    </div>
                  </div>
                </Accordion>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <main className={styles.main}>
        <MapWidget markers={searchedMarkers} selectedMarkers={selectedMarkers} />
      </main>
    </div>
  );
}
