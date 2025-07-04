import React, { useState } from 'react';
import { MapWidget } from '@/features/map';
import styles from './MapPage.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';
import SearchIcon from '@/assets/icons/search.svg?react';
import Papa from 'papaparse';
import type { MapMarker } from '@/types';
import { useDebounce } from '@/hooks';
import { Accordion, Skeleton } from '@/components';

export function MapPage() {
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [searchedMarkers, setSearchedMarkers] = useState<MapMarker[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const search = (query: string) => {
    const processedQuery = query.trim().toLowerCase();
    setSearchedMarkers(
      markers.filter((marker) => marker.name.trim().toLowerCase().includes(processedQuery))
    );
  };

  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    setLoading(true);
    setFile(file);

    setSearchTerm('');
    setSearchedMarkers([]);
    setSelectedMarkers(new Set());

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsedData = results.data as MapMarker[];

        setMarkers(parsedData);
        setSearchedMarkers(parsedData);
        setLoading(false);
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setLoading(false);
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInfo}>
            <div>
              <MapIcon width="1.5rem" />
              <h2>Объекты</h2>
            </div>
            <label className={styles.fileUpload} htmlFor="fileInput">
              <input
                onChange={handleFileUpload}
                className={styles.fileInput}
                id="fileInput"
                type="file"
                accept=".csv"
              />
              <LoadFileIcon width="1.5rem" />
            </label>
          </div>

          <div className={styles.sidebarContent}>
            <label className={styles.search} htmlFor="searchInput">
              <input
                id="searchInput"
                type="search"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <SearchIcon />
            </label>

            <div className={styles.accordions}>
              {loading &&
                Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton width="100%" height={35} key={i} />
                ))}

              {file ? (
                searchedMarkers.length > 0 ? (
                  searchedMarkers.map((marker) => (
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
                          {marker.description ?? (
                            <span className={styles.descriptionMissing}>Описания нет</span>
                          )}
                        </div>
                      </div>
                    </Accordion>
                  ))
                ) : (
                  <>{!loading && <div className={styles.noFile}>Ничего не найдено</div>}</>
                )
              ) : (
                <div className={styles.noFile}>Файл не выбран</div>
              )}
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
