import { Outlet } from 'react-router';
import styles from './MapLayout.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import LoadFileIcon from '@/assets/icons/load-file.svg?react';

export function MapLayout() {
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
            <div className={styles.search}>Поиск</div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div className={styles.accordion}>ТП-{i + 1}</div>
            ))}
          </div>
        </aside>
      </div>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
