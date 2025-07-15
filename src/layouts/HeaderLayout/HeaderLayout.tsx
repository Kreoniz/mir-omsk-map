import { Outlet } from 'react-router';
import styles from './HeaderLayout.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import ExitIcon from '@/assets/icons/exit.svg?react';
import { Clock, ThemeToggle } from '@/components/ui';

export function HeaderLayout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headingBlock}>
          <MapIcon width="1.5rem" />
          <h1 className={styles.heading}>Карта</h1>
        </div>

        <div className={styles.appName}>Маркер</div>

        <div className={styles.info}>
          <ThemeToggle />

          <div className={styles.timeInfo}>
            <ClockIcon width="1.25rem" />
            <Clock />
          </div>

          <div className={styles.userInfo}>
            <div>Администратор</div>
            <button type="button" className={styles.exitButton}>
              <ExitIcon width="1.25rem" />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
