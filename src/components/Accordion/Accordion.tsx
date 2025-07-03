import { useState, useRef } from 'react';
import styles from './Accordion.module.scss';
import ExpandIcon from '@/assets/icons/arrow-down.svg?react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accordionContent = useRef<HTMLDivElement>(null);

  const expand = () => {
    if (accordionContent.current) {
      if (isOpen) {
        accordionContent.current.style.maxHeight = '0';
        setIsOpen(false);
      } else {
        accordionContent.current.style.maxHeight = accordionContent.current.scrollHeight + 'px';
        setIsOpen(true);
      }
    }
  };

  return (
    <div className={styles.accordion}>
      <button onClick={expand} className={styles.header}>
        {title}
        <ExpandIcon className={`${styles.icon} ${isOpen ? styles.rotated : ''}`} />
      </button>

      <div ref={accordionContent} className={styles.container}>
        <div className={styles.delimiter}></div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
