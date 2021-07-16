import React, { useState, useRef, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './popupSlice';
import styles from './Popup.module.css';

interface labelProps {
    label: string,
    value: string
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
    )
}

export function Popup() {

  return (
     <div className={styles.containerBackground}>
         <div className={styles.container}>
             <div className={styles.header}>
                 <h3 className={styles.title}>Wapley Camera Trap</h3>
                 <img className={styles.cancel} src="https://img.icons8.com/cotton/32/000000/cancel--v2.png"/>
             </div>
             <div className={styles.body}>
                 <Label label="Latitude" value="-2.56"/>
                 <Label label="Longitude" value="51.54331"/>
                 <Label label="Images" value="160"/>
             </div>
         </div>
     </div>
  );
}
