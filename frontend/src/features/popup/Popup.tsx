import React, { useEffect } from "react";

import { Button, TrashIcon, CloudUploadIcon, MediaIcon } from "evergreen-ui";

import styles from "./Popup.module.css";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { closePopUp } from "../popup/popupSlice";
import { getPopUpInfo, getPopUpStatus } from "./popupSlice";
import { browserInfo, closeBrowser } from "../browser/browserSlice";
import { useAppDispatch } from "../../app/hooks";

interface labelProps {
  label: string;
  value: string;
}

interface WrapperProps {
  onDeleteCamera(id: number): void;
  onOpenBrowser(browserInfo: browserInfo): void;
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
}: Props) {
  const dispatch = useAppDispatch();

  // On Open, Close Browser
  // This effect listens for changes in popUpState, and triggers when it's open, therefore
  // it triggers when the PopUp opens. It dispatches an action to close the browser so that
  // they are not both on the screen at the same time.
  useEffect(() => {
    if (popUpState) {
      dispatch(closeBrowser());
    }
  }, [popUpState, dispatch]);

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
              <Label label="Latitude" value={popUpInfo.latitude.toString()} />
              <Label label="Longitude" value={popUpInfo.longitude.toString()} />
              <Label label="Images" value={popUpInfo.numImages.toString()} />
            </div>
            <div className={styles.footer}>
              <Button
                className={styles.button}
                marginRight={12}
                iconBefore={TrashIcon}
                intent="danger"
                onClick={() => {
                  closePopUp();
                  onDeleteCamera(popUpInfo.id);
                }}
              >
                Delete
              </Button>
              <Button
                className={styles.button}
                marginRight={12}
                iconBefore={CloudUploadIcon}
                intent="none"
              >
                Upload Images
              </Button>
              <Button
                className={styles.button}
                marginRight={16}
                intent="none"
                iconBefore={MediaIcon}
                onClick={() => {
                  closePopUp();
                  onOpenBrowser({
                    id: popUpInfo.id,
                    name: popUpInfo.name,
                  });
                }}
              >
                Browser
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default connector(Popup);
