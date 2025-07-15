import React, { memo, useState } from 'react';
import { useDebounce } from '@/hooks/';
import SearchIcon from '@/assets/icons/search.svg?react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBar = memo<SearchBarProps>(({ value, onChange }) => {
  const [local, setLocal] = useState(value);

  const debouncedOnChange = useDebounce(onChange, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocal(next);
    debouncedOnChange(next);
  };

  return (
    <label className={styles.search} htmlFor="searchInput">
      <input
        id="searchInput"
        type="search"
        placeholder="Поиск..."
        value={local}
        onChange={handleChange}
      />
      <SearchIcon />
    </label>
  );
});
