import React from "react";

import { Button, TrashIcon } from "evergreen-ui";

import styles from "./Popup.module.css";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { closePopUp } from "../popup/popupSlice";
import { getPopUpInfo, getPopUpStatus } from "./popupSlice";

interface labelProps {
  label: string;
  value: string;
}

interface WrapperProps {
  handleDeleteCamera(id: number): void;
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
  handleDeleteCamera,
}: Props) {
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
                  handleDeleteCamera(popUpInfo.id);
                }}
              >
                Delete
              </Button>
              <Button className={styles.button} marginRight={16} intent="none">
                Image Browser
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default connector(Popup);
