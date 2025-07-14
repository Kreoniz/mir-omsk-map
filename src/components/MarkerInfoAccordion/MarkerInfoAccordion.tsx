import { memo } from 'react';
import { Accordion } from '@/components/ui';
import styles from './MarkerInfoAccordion.module.scss';
import type { MapMarker } from '@/types';

interface MarkerInfoAccordionProps {
  marker: MapMarker;
  onOpen?: () => void;
  onClose?: () => void;
  forceOpen?: boolean;
}

function MarkerInfoAccordionContent({
  marker,
  onOpen,
  onClose,
  forceOpen,
}: MarkerInfoAccordionProps) {
  return (
    <Accordion
      className={styles.accordion}
      key={marker.name}
      title={marker.name}
      onOpen={onOpen}
      onClose={onClose}
      forceOpen={forceOpen}
    >
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.heading}>Координаты</div>
          <div className={styles.content}>
            {marker.latitude}, {marker.longitude}
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.heading}>Описание</div>
          <div className={styles.content}>
            {marker.description ?? <span className={styles.descriptionMissing}>-</span>}
          </div>
        </div>
      </div>
    </Accordion>
  );
}

export const MarkerInfoAccordion = memo(
  MarkerInfoAccordionContent,
  (prevProps, nextProps) => prevProps.forceOpen === nextProps.forceOpen
);
