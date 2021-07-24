import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  TrashIcon,
  CloudUploadIcon,
  MediaIcon,
  FilePicker,
  Spinner,
  Pane,
  Dialog, TextInputField
} from "evergreen-ui";

import { v4 } from "uuid";
import styles from "./Popup.module.css";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { closePopUp, openPopUp } from "../popup/popupSlice";
import { getPopUpInfo, getPopUpStatus } from "./popupSlice";
import { browserInfo, closeBrowser } from "../browser/browserSlice";
import { useAppDispatch } from "../../app/hooks";
import { LoginState } from "../login/loginSlice";

interface labelProps {
  label: string;
  value: string | number;
}

interface WrapperProps {
  onDeleteCamera(id: number): void;
  onOpenBrowser(browserInfo: browserInfo): void;
  login: LoginState;
}

export function SimpleLabel(props: labelProps) {
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

interface DialogProps {
  confirmDelete(): void;
}

function ConfirmDeleteDialog({
  confirmDelete,
}: DialogProps) {
  const [isShown, setIsShown] = React.useState(false)

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Delete Camera"
        intent="danger"
        onCloseComplete={() => setIsShown(false)}
        onConfirm={() => {
          setIsShown(false)
          confirmDelete()
        }}
        confirmLabel="Delete Camera"
      >
        Are you sure you want to delete this camera? This action cannot be undone.
      </Dialog>

      <Button
        className={styles.button}
        marginRight={12}
        iconBefore={TrashIcon}
        intent="danger"
        onClick={() => {
          setIsShown(true);
        }}
      >
        Delete Camera
      </Button>
    </Pane>
  )
}

const mapStateToProps = (state: RootState, wrapperProps: WrapperProps) => ({
  popUpState: getPopUpStatus(state),
  popUpInfo: getPopUpInfo(state),
  ...wrapperProps,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  closePopUp: () => dispatch(closePopUp()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Popup({
  popUpState,
  popUpInfo,
  closePopUp,
  onDeleteCamera,
  onOpenBrowser,
  login,
}: Props) {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploaded, setUploaded] = useState(0);
  const [toUpload, setToUpload] = useState(0);
  const [imageCount, setImageCount] = useState(0);

  // On Open, Close Browser
  // This effect listens for changes in popUpState, and triggers when it's open, therefore
  // it triggers when the PopUp opens. It dispatches an action to close the browser so that
  // they are not both on the screen at the same time.
  useEffect(() => {
    if (popUpState) {
      dispatch(closeBrowser());
    }
  }, [popUpState, dispatch]);

  const onFileUpload = useCallback(() => {
    if (files !== null) {
      setUploaded(0);
      setToUpload(files.length);
      for (let i = 0; i < files.length; i++) {
        // Create the UUID name.
        const re = /(?:\.([^.]+))?$/;
        const result = re.exec(files[i].name);
        if (result !== null) {
          const uuid_name = v4().toString() + result[0].toString();

          // Post data.
          const formData = new FormData();
          formData.append("File", files[i], uuid_name);

          fetch(`http://localstack:4566/images/${uuid_name}`, {
            method: "PUT",
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                return response.text();
              } else {
                throw new Error("Couldn't get presigned URL.");
              }
            })
            .then((data) => {
              // Try and create camera in backend.
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${login.token}`,
                },
                body: JSON.stringify({
                  object_key: uuid_name,
                  camera: popUpInfo.id,
                }),
              };

              fetch("http://localhost:8000/web/images/", requestOptions)
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error("Couldn't post camera.");
                  }
                })
                .then((data) => {
                  setUploaded((uploaded) => uploaded + 1);
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        }
      }
      setImageCount(files.length);
    }
  }, [login, files, popUpInfo]);

  const getImageCount = useEffect(() => {
    // Try and create camera in backend.
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${login.token}`,
      },
    };

    fetch(`http://localhost:8000/web/cameras/${popUpInfo.id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Couldn't get count.");
        }
      })
      .then((data) => {
        console.log(data);
        setImageCount(data.image_count);
      })
      .catch((error) => console.log(error));
  }, [login, popUpInfo, files]);

  return (
    <div>
      {popUpState ? (
        <div className={styles.containerBackground}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h3 className={styles.title}>{popUpInfo.name}</h3>
              <h3 onClick={() => closePopUp()} className={styles.cancel}>
                ✕
              </h3>
            </div>
            <div className={styles.body}>
              <SimpleLabel
                label="Latitude"
                value={popUpInfo.latitude.toString()}
              />
              <SimpleLabel
                label="Longitude"
                value={popUpInfo.longitude.toString()}
              />
              <SimpleLabel label="Images" value={imageCount} />
            </div>
            <div className={styles.body}>
              <h3>Upload images to this camera</h3>
              <div style={{ display: "flex" }}>
                <FilePicker
                  className={styles.button}
                  multiple
                  width={300}
                  marginRight={12}
                  onChange={(files) => setFiles(files)}
                  placeholder="Upload Images"
                />
                <Button
                  className={styles.button}
                  marginRight={12}
                  iconBefore={CloudUploadIcon}
                  intent="none"
                  onClick={onFileUpload}
                >
                  Upload
                </Button>
              </div>
              {toUpload !== uploaded ? (
                <div style={{ display: "flex", paddingTop: "20px" }}>
                  <Spinner size={16} marginRight={12} />
                  <SimpleLabel
                    label="Uploaded"
                    value={`${Math.round((uploaded / toUpload) * 100)}%`}
                  />
                </div>
              ) : null}
            </div>
            <div className={styles.footer}>
              <ConfirmDeleteDialog confirmDelete={() => {
                closePopUp();
                onDeleteCamera(popUpInfo.id);
              }}/>
              <Button
                className={styles.button}
                marginRight={16}
                intent="none"
                iconBefore={MediaIcon}
                disabled={imageCount === 0}
                onClick={() => {
                  closePopUp();
                  onOpenBrowser({
                    id: popUpInfo.id,
                    name: popUpInfo.name,
                  });
                }}
              >
                Browse Images
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default connector(Popup);
