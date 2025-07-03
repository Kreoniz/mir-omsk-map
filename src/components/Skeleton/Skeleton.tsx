import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ width, height }: SkeletonProps) {
  return <div className={styles.shimmer} style={{ width, height }}></div>;
}
