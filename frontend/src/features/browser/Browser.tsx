import { SegmentedControl, Pagination } from 'evergreen-ui';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from '../../app/store';
import { closeBrowser } from '../browser/browserSlice';
import { LoginState } from '../login/loginSlice';

import { Tile } from './components/Tile';
import styles from './Browser.module.css';
import { getBrowserInfo, getBrowserStatus } from './browserSlice';
import { Image } from './types';
import { getImages } from './api';

const mapStateToProps = (state: RootState, wrapperState: { login: LoginState }) => ({
  browserState: getBrowserStatus(state),
  browserInfo: getBrowserInfo(state),
  ...wrapperState,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  closeBrowser: () => dispatch(closeBrowser()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Browser({ browserState, browserInfo, closeBrowser, login }: Props) {
  const [options] = React.useState([
    { label: 'Fox', value: 'fox' },
    { label: 'Badger', value: 'badger' },
    { label: 'Cat', value: 'cat' },
  ]);
  const [ordering, setOrdering] = React.useState<string | number | boolean>('fox');
  const [images, setImages] = React.useState<Image[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    if (browserState) {
      setImages([]);
      setTotalPages(1);
      setPage(1);
    }
  }, [browserState]);

  useEffect(() => {
    if (browserState) {
      // Exit early if id is the default.
      if (browserInfo.id === 0) return;

      getImages(login, browserInfo.id, page, ordering).then((data) => {
        setTotalPages(data.pages);
        setImages(data.images);
      });
    }
  }, [page, browserState, browserInfo, login, ordering]);

  // Poll Server for Updates
  // This checks to see if any images are still waiting, if they are it calls the server.
  // This runs every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      if (images.map((image) => image.waiting).some((element) => element)) {
        getImages(login, browserInfo.id, page, ordering).then((data) => {
          setTotalPages(data.pages);
          setImages(data.images);
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div>
      {browserState ? (
        <div className={styles.containerBackground}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h3 className={styles.title}>{browserInfo.name}</h3>
              <h3
                onClick={() => {
                  setImages([]);
                  closeBrowser();
                }}
                className={styles.cancel}
              >
                ✕
              </h3>
            </div>
            <div className={styles.filterBar}>
              <SegmentedControl
                width={240}
                size="small"
                options={options}
                value={ordering}
                onChange={(value) => setOrdering(value)}
              />
            </div>
            <div className={styles.canvas}>
              {images.length !== 0 ? (
                <div className={styles.columnContainer}>
                  <div className={styles.rowContainer}>
                    <Tile image={images[0]} />
                    <Tile image={images[1]} />
                    <Tile image={images[2]} />
                  </div>
                  <div className={styles.rowContainer}>
                    <Tile image={images[3]} />
                    <Tile image={images[4]} />
                    <Tile image={images[5]} />
                  </div>
                </div>
              ) : (
                <div className={styles.splash}>
                  <h1>No images</h1>
                </div>
              )}
            </div>
            <div className={styles.footer}>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                }}
                onNextPage={() => {
                  setPage((oldPage) => oldPage + 1);
                }}
                onPreviousPage={() => {
                  setPage((oldPage) => oldPage - 1);
                }}
              ></Pagination>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default connector(Browser);
