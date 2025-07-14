import { useTheme } from '@/hooks/useTheme';
import MoonIcon from '@/assets/icons/moon.svg?react';
import SunIcon from '@/assets/icons/sun.svg?react';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
