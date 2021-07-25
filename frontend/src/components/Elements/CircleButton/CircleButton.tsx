import { Dialog } from 'evergreen-ui';
import React, { useCallback } from 'react';

import styles from './Circle.module.css';

interface Props {
  text: string;
  dialog?: boolean;
  dialogTitle?: string;
  dialogBody?: string;
  dialogButton?: string;
  callback(): void;
}

export function CircleButton({
  text,
  dialog = false,
  callback,
  dialogTitle = '',
  dialogBody = '',
  dialogButton = '',
}: Props) {
  const [isShown, setIsShown] = React.useState(false);

  const handleClick = useCallback(() => {
    if (dialog) {
      setIsShown(true);
    } else {
      callback();
    }
  }, [callback, dialog, setIsShown]);

  return (
    <div className={styles.circleContainer}>
      <Dialog
        isShown={isShown}
        title={dialogTitle}
        intent="danger"
        onCloseComplete={() => setIsShown(false)}
        onConfirm={() => callback()}
        confirmLabel={dialogButton}
      >
        {dialogBody}
      </Dialog>
      <div onClick={handleClick} className={styles.circle} data-name={`circle-button-${text}`}>
        <h1>{text}</h1>
      </div>
    </div>
  );
}
