import { useState } from 'react';
import { Outlet } from 'react-router';
import dayjs from 'dayjs';
import styles from './HeaderLayout.module.scss';
import MapIcon from '@/assets/icons/map.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import ExitIcon from '@/assets/icons/exit.svg?react';

export function HeaderLayout() {
  const [clock, setClock] = useState(dayjs().format('DD.MM.YYYY HH:mm:ss'));
  setInterval(() => {
    setClock(dayjs().format('DD.MM.YYYY HH:mm:ss'));
  }, 1000);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headingBlock}>
          <MapIcon width="1.5rem" />
          <h1 className={styles.heading}>КАРТА</h1>
        </div>

        <div>Название системы</div>

        <div className={styles.info}>
          <div className={styles.timeInfo}>
            <ClockIcon width="1.25rem" />
            <div>{clock}</div>
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
