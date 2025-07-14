import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './MapPage.module.scss';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';
import SearchIcon from '@/assets/icons/search.svg?react';
import MarkerIcon from '@/assets/icons/marker.svg?react';
import Papa from 'papaparse';
import type { MapMarker } from '@/types';
import { Skeleton } from '@/components/ui';
import { MarkerInfoAccordion, MapWidget } from '@/components';
import { useToast } from '@/hooks';

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Ошибка при загрузке из localStorage', error);
    return defaultValue;
  }
};

const saveToLocalStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage', error);
  }
};

export function MapPage() {
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>(() =>
    loadFromLocalStorage<MapMarker[]>('markers', [])
  );
  const [searchTerm, setSearchTerm] = useState(() =>
    loadFromLocalStorage<string>('searchTerm', '')
  );
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(
    () => new Set(loadFromLocalStorage<string[]>('selectedMarkers', []))
  );

  const { toast } = useToast();

  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const markersRef = useRef(markers);
  const searchTermRef = useRef(searchTerm);
  const selectedMarkersRef = useRef(selectedMarkers);

  const [lastPanTarget, setLastPanTarget] = useState<string | undefined>();
  const [lastScrollTarget, setLastScrollTarget] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    selectedMarkersRef.current = selectedMarkers;
  }, [selectedMarkers]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage('markers', markersRef.current);
      saveToLocalStorage('searchTerm', searchTermRef.current);
      saveToLocalStorage('selectedMarkers', Array.from(selectedMarkersRef.current));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (lastScrollTarget && accordionRefs.current[lastScrollTarget]) {
      accordionRefs.current[lastScrollTarget]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [lastScrollTarget]);

  const handleMapSelect = (name: string) => {
    setSelectedMarkers((prev) => new Set(prev).add(name));
    setLastPanTarget(name);
    setLastScrollTarget(name);
  };

  const handleSidebarOpen = (name: string) => {
    setSelectedMarkers((prev) => new Set(prev).add(name));
    setLastPanTarget(name);
  };

  const handleClose = (name: string) => {
    setSelectedMarkers((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const searchedMarkers = useMemo(() => {
    const processedQuery = debouncedSearchTerm.trim().toLowerCase();
    return markers.filter((marker) => marker.name.trim().toLowerCase().includes(processedQuery));
  }, [markers, debouncedSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    setLoading(true);
    setSearchTerm('');
    setSelectedMarkers(new Set());

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const { data, meta, errors } = results;

          if (errors && errors.length > 0) {
            console.error('Ошибки при разборе CSV:', errors);
            toast('Произошла ошибка при разборе CSV.', 'error');
            setLoading(false);
            return;
          }

          const requiredFields = ['name', 'longitude', 'latitude'];
          const missingFields = requiredFields.filter((field) => !meta.fields?.includes(field));

          if (missingFields.length > 0) {
            toast(`Нужны поля: ${missingFields.join(', ')}`, 'error');
            setLoading(false);
            return;
          }

          const invalidRows = (data as MapMarker[]).filter(
            (row) => !row.name || row.longitude == null || row.latitude == null
          );

          if (invalidRows.length > 0) {
            toast('В файле есть строки с пропущенными значениями.', 'error');
            setLoading(false);
            return;
          }

          const parsedData = data as MapMarker[];

          toast('Файл успешно загружен!', 'success');
          setMarkers(parsedData);
          setLoading(false);
        },
        error: (err) => {
          console.error('Ошибка при разборе CSV:', err);
          toast('Ошибка в обработке файла.', 'error');
          setLoading(false);
        },
      });
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message, 'error');
      setLoading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInfo}>
            <div className={styles.sidebarHeading}>
              <MarkerIcon width="1.5rem" />
              <h2>Объекты</h2>
            </div>
            <label className={styles.fileUpload} htmlFor="fileInput">
              <div className={styles.tooltipText}>Загрузить .csv файл</div>
              <input
                ref={fileInputRef}
                onChange={handleFileUpload}
                className={styles.fileInput}
                id="fileInput"
                type="file"
                accept=".csv"
              />
              <LoadFileIcon width="1.5rem" />
            </label>
          </div>
          <div className={styles.searchBlock}>
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
          </div>

          <div className={styles.sidebarContent}>
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <Skeleton width="100%" height={35} key={i} />
              ))
            ) : markers.length > 0 ? (
              searchedMarkers.length > 0 ? (
                searchedMarkers.map((marker) => {
                  const isOpen = selectedMarkers.has(marker.name);
                  return (
                    <div
                      className={styles.accordionWrapper}
                      key={marker.name}
                      tabIndex={-1}
                      ref={(el) => {
                        if (el) accordionRefs.current[marker.name] = el;
                      }}
                    >
                      <MarkerInfoAccordion
                        marker={marker}
                        forceOpen={isOpen}
                        onOpen={() => handleSidebarOpen(marker.name)}
                        onClose={() => handleClose(marker.name)}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={styles.noFile}>Ничего не найдено</div>
              )
            ) : (
              <div className={styles.noFile}>Файл не выбран</div>
            )}
          </div>
        </aside>
      </div>

      <main className={styles.main}>
        <MapWidget
          markers={searchedMarkers}
          selectedMarkers={selectedMarkers}
          onMarkerToggle={(name) =>
            selectedMarkers.has(name) ? handleClose(name) : handleMapSelect(name)
          }
          lastToggled={lastPanTarget}
        />
      </main>
    </div>
  );
}
