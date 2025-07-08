import { useState, useRef } from 'react';
import styles from './Accordion.module.scss';
import ExpandIcon from '@/assets/icons/arrow-down.svg?react';

interface AccordionProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

export function Accordion({ className, title, children, onOpen, onClose }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accordionContent = useRef<HTMLDivElement>(null);

  const expand = () => {
    if (accordionContent.current) {
      if (isOpen) {
        accordionContent.current.style.maxHeight = '0';
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
      } else {
        accordionContent.current.style.maxHeight = accordionContent.current.scrollHeight + 'px';
        setIsOpen(true);
        if (onOpen) {
          onOpen();
        }
      }
    }
  };

  return (
    <div className={`${styles.accordion} ${className}`}>
      <button
        onClick={expand}
        className={`${styles.header} ${isOpen ? styles.expandedHeader : ''}`}
      >
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
