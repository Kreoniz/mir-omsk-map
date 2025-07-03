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

  const accordionItems = [
    {
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces.',
    },
    {
      title: 'Why use SCSS Modules?',
      content: 'SCSS Modules provide scoped styles and better maintainability.',
    },
    {
      title: 'How does this accordion work?',
      content:
        'It uses CSS transitions for animations and React state management for toggle behavior.',
    },
  ];

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

            {accordionItems.map((item, i) => (
              <Accordion key={i} title={item.title}>
                {item.content}
              </Accordion>
            ))}
            <div>
              {searchedMarkers.map((marker, i) => (
                <div key={i} className={styles.accordion}>
                  {marker.name}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <main className={styles.main}>
        <MapWidget markers={searchedMarkers} />
      </main>
    </div>
  );
}
