import styles from './SimpleLabel.module.css';
import React from 'react';

interface labelProps {
  label: string;
  value: string | number;
}

export function SimpleLabel(props: labelProps) {
  return (
    <div className={styles.container}>
      <div className={styles.key}>
        <p>{props.label}</p>
      </div>
      <div className={styles.value}>
        <p data-name={`label-${props.label}`}>{props.value}</p>
      </div>
    </div>
  );
}
