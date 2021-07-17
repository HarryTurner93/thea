import React from "react";

import styles from "./Popup.module.css";

interface labelProps {
  label: string;
  value: string;
}

function Label(props: labelProps) {
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelKey}>
        <p>{props.label}</p>
      </div>
      <div className={styles.labelValue}>
        <p>{props.value}</p>
      </div>
    </div>
  );
}

export function Popup() {
  return (
    <div className={styles.containerBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Wapley Camera Trap</h3>
          <h3 className={styles.cancel}>✕</h3>
        </div>
        <div className={styles.body}>
          <Label label="Latitude" value="-2.56" />
          <Label label="Longitude" value="51.54331" />
          <Label label="Images" value="160" />
        </div>
        <div className={styles.footer}>
          <div className={`${styles.iconButton} ${styles.deleteButton}`}>
            <h4>Delete</h4>
          </div>
          <div className={styles.iconButton}>
            <h4>Image Browser</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
