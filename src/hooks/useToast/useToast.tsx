import { toast, type ToastOptions } from 'react-hot-toast';
import styles from './useToast.module.scss';
import InfoIcon from '@/assets/icons/info.svg?react';
import CheckIcon from '@/assets/icons/check.svg?react';
import WarningIcon from '@/assets/icons/flag.svg?react';
import ErrorIcon from '@/assets/icons/error.svg?react';

const toastConfig = {
  success: {
    icon: <CheckIcon className={styles.icon} />,
    className: styles.success,
  },
  error: {
    icon: <ErrorIcon className={styles.icon} />,
    className: styles.error,
  },
  warning: {
    icon: <WarningIcon className={styles.icon} />,
    className: styles.warning,
  },
  info: {
    icon: <InfoIcon className={styles.icon} />,
    className: styles.info,
  },
};

export function useToast() {
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    options?: ToastOptions
  ) => {
    const { icon, className } = toastConfig[type];

    toast.custom(
      () => (
        <div className={`${styles.toast} ${className}`}>
          {icon}
          <span>{message}</span>
        </div>
      ),
      options
    );
  };

  return {
    toast: showToast,
    dismiss: toast.dismiss,
  };
}
