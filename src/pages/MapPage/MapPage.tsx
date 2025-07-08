import React, { useState, useRef, useEffect } from 'react';
import styles from './MapPage.module.scss';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';
import SearchIcon from '@/assets/icons/search.svg?react';
import MarkerIcon from '@/assets/icons/marker.svg?react';
import Papa from 'papaparse';
import type { MapMarker } from '@/types';
import { useDebounce } from '@/hooks';
import { Skeleton } from '@/components/ui';
import { MarkerInfoAccordion, MapWidget } from '@/components';
import { useToast } from '@/hooks';

export function MapPage() {
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [searchedMarkers, setSearchedMarkers] = useState<MapMarker[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { toast } = useToast();

  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lastPanTarget, setLastPanTarget] = useState<string>();
  const [lastScrollTarget, setLastScrollTarget] = useState<string>();

  useEffect(() => {
    if (lastScrollTarget && accordionRefs.current[lastScrollTarget]) {
      accordionRefs.current[lastScrollTarget].scrollIntoView({
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

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const { data, meta, errors } = results;

          if (errors && errors.length > 0) {
            console.error('CSV parsing errors:', errors);
            toast('CSV parsing error occurred.', 'error');
            setLoading(false);
            return;
          }

          const requiredFields = ['name', 'longitude', 'latitude'];
          const missingFields = requiredFields.filter((field) => !meta.fields?.includes(field));

          if (missingFields.length > 0) {
            toast(`Нужны поля: ${missingFields.join(', ')}`, 'error');
            setFile(null);
            setLoading(false);
            return;
          }

          const invalidRows = (data as any[]).filter(
            (row) => !row.name || row.longitude == null || row.latitude == null
          );

          if (invalidRows.length > 0) {
            toast('В файле есть строки с пропущенными значениями.', 'error');
            setFile(null);
            setLoading(false);
            return;
          }

          const parsedData = data as MapMarker[];

          setMarkers(parsedData);
          setSearchedMarkers(parsedData);
          setLoading(false);
        },
        error: (err) => {
          console.error('CSV parsing error:', err);
          toast('Ошибка в обработке файла.', 'error');
          setFile(null);
          setLoading(false);
        },
      });
    } catch (e: any) {
      toast(e.message, 'error');
      setLoading(false);
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
            {loading &&
              Array.from({ length: 15 }).map((_, i) => (
                <Skeleton width="100%" height={35} key={i} />
              ))}

            {file ? (
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
                <>{!loading && <div className={styles.noFile}>Ничего не найдено</div>}</>
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
