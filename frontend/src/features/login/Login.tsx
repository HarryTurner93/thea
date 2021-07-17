import React from "react";
import { Button, Pane, TextInput } from "evergreen-ui";
import { useHistory } from "react-router-dom";

import styles from "./Login.module.css";

export function Login() {
  const history = useHistory();

  function handleClick() {

  }

  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Pane className={styles.container}>
          <TextInput
            className={styles.input}
            name="username-input"
            placeholder="username"
          />
          <TextInput
            className={styles.input}
            name="password-input"
            placeholder="password"
          />
          <Button
            className={styles.button}
            onClick={handleClick}
            marginRight={16}
            intent="none"
          >
            Login
          </Button>
        </Pane>
      </div>
    </div>
  );
}
