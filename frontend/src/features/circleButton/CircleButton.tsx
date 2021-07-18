import React, { useCallback } from "react";
import { Pane, Dialog, Button } from "evergreen-ui";

import styles from "./Circle.module.css";

interface Props {
  text: string;
  doPopUp?: boolean;
  callback(): void;
}

export function CircleButton({ text, doPopUp = false, callback }: Props) {
  const [isShown, setIsShown] = React.useState(false);

  const handleClick = useCallback(() => {
    if (doPopUp) {
      setIsShown(true);
    } else {
      callback();
    }
  }, [callback, doPopUp, setIsShown]);

  return (
    <div className={styles.circleContainer}>
      <Dialog
        isShown={isShown}
        title="Log out?"
        onCloseComplete={() => {
          setIsShown(false);
          callback();
        }}
        confirmLabel="Log Out"
      >
        Confirm that you want to log out.
      </Dialog>
      <div onClick={handleClick} className={styles.circle}>
        <h1>{text}</h1>
      </div>
    </div>
  );
}
