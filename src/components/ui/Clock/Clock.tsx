import { useState } from 'react';
import dayjs from 'dayjs';

export function Clock() {
  const [clock, setClock] = useState(dayjs().format('DD.MM.YYYY HH:mm:ss'));

  setInterval(() => {
    setClock(dayjs().format('DD.MM.YYYY HH:mm:ss'));
  }, 1000);

  return <div>{clock}</div>;
}
