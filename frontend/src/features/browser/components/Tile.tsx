import { SimpleLabel } from '../../../components/Elements/SimpleLabel';
import { Spinner } from 'evergreen-ui';
import React from 'react';
import { Image } from '../types';
import styles from './Tile.module.css';

interface TileProps {
  image: Image;
  waiting: boolean;
}

export function Tile({ image, waiting }: TileProps) {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        alt={image ? image.object_key : 'Placeholder'}
        src={
          image
            ? `http://localstack:4566/images/${image.object_key}`
            : 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640'
        }
      />
      {image ? (
        waiting ? (
          <div className={styles.tightLabelContainer}>
            <h3>Waiting for results...</h3>
            <Spinner marginLeft={16} size={16} />
          </div>
        ) : (
          <div className={styles.labelContainer}>
            <SimpleLabel label="Fox" value={`${Math.round(image.fox * 100)}%`} />
            <SimpleLabel label="Badger" value={`${Math.round(image.badger * 100)}%`} />
            <SimpleLabel label="Cat" value={`${Math.round(image.cat * 100)}%`} />
          </div>
        )
      ) : null}
    </div>
  );
}
