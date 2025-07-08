import { useState, useRef, useEffect } from 'react';
import styles from './Accordion.module.scss';
import ExpandIcon from '@/assets/icons/arrow-down.svg?react';

interface AccordionProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  forceOpen?: boolean;
}

export function Accordion({
  className,
  title,
  children,
  onOpen,
  onClose,
  forceOpen,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(!!forceOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof forceOpen === 'boolean') {
      setIsOpen(forceOpen);
    }
  }, [forceOpen]);

  useEffect(() => {
    if (isOpen && headerRef.current) {
      headerRef.current.focus({ preventScroll: true });
    }

    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0';
    }
  }, [isOpen]);

  const expand = () => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = '0';
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
      } else {
        contentRef.current.style.maxHeight = contentRef.current.scrollHeight + 'px';
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
        ref={headerRef}
        onClick={expand}
        className={`${styles.header} ${isOpen ? styles.expandedHeader : ''}`}
      >
        {title}
        <ExpandIcon className={`${styles.icon} ${isOpen ? styles.rotated : ''}`} />
      </button>

      <div ref={contentRef} className={styles.container}>
        <div className={styles.delimiter}></div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
