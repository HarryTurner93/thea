import React, { useEffect } from "react";

import { SegmentedControl, Pagination } from "evergreen-ui";

import styles from "./Browser.module.css";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { closeBrowser } from "../browser/browserSlice";
import { getBrowserInfo, getBrowserStatus } from "./browserSlice";
import { LoginState } from "../login/loginSlice";
import { SimpleLabel } from "../popup/Popup";

type WrapperState = {
  login: LoginState;
};

type ImageInfo = {
  object_key: string;
  fox: number;
  badger: number;
  cat: number;
  camera: number;
};

const mapStateToProps = (state: RootState, wrapperState: WrapperState) => ({
  browserState: getBrowserStatus(state),
  browserInfo: getBrowserInfo(state),
  ...wrapperState,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  closeBrowser: () => dispatch(closeBrowser()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

interface ImageProps {
  imageData: {
    object_key: string;
    badger: number;
    cat: number;
    fox: number;
  };
}

function Image({ imageData }: ImageProps) {
  return (
    <div className={styles.imageContainer}>
      <img
        style={{ width: "300px", height: "200px" }}
        // Todo: Is this a pattern that has a short version?
        alt={imageData.object_key ? imageData.object_key : "Placeholder"}
        src={
          imageData
            ? `http://localstack:4566/images/${imageData.object_key}`
            : "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640"
        }
      />
      {imageData ? (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <SimpleLabel
            label="Fox"
            value={`${Math.round(imageData.fox * 100)}%`}
          />
          <SimpleLabel
            label="Badger"
            value={`${Math.round(imageData.badger * 100)}%`}
          />
          <SimpleLabel
            label="Cat"
            value={`${Math.round(imageData.cat * 100)}%`}
          />
        </div>
      ) : null}
    </div>
  );
}

function Browser({ browserState, browserInfo, closeBrowser, login }: Props) {
  const [options] = React.useState([
    { label: "Fox", value: "fox" },
    { label: "Badger", value: "badger" },
    { label: "Cat", value: "cat" },
  ]);
  const [ordering, setOrdering] = React.useState<string | number | boolean>(
    "fox"
  );
  const [images, setImages] = React.useState<ImageInfo[]>([]);
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

      // Try and create camera in backend.
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${login.token}`,
        },
      };

      fetch(
        `http://localhost:8000/web/images/?camera_id=${browserInfo.id}&page=${page}&ordering=-${ordering}`,
        requestOptions
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Couldn't post camera.");
          }
        })
        .then((data) => {
          setTotalPages(Math.ceil(data.count / 6));
          setImages(data.results);
        })
        .catch((error) => console.log(error));
    }
  }, [page, browserState, browserInfo, login, ordering]);

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
                    <Image imageData={images[0]} />
                    <Image imageData={images[1]} />
                    <Image imageData={images[2]} />
                  </div>
                  <div className={styles.rowContainer}>
                    <Image imageData={images[3]} />
                    <Image imageData={images[4]} />
                    <Image imageData={images[5]} />
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
