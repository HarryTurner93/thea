import React, { useCallback, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Button, Pane, TextInput } from "evergreen-ui";
import { LoginState, setLogin } from "./loginSlice";

import styles from "./Login.module.css";

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLogin: (token: LoginState) => dispatch(setLogin(token)),
});
const connector = connect(null, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Login({ setLogin }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClick = useCallback(() => {
    // Reset error message.
    setErrorMessage("");

    // Attempt to login.
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    // Todo: Move this to environment variable.
    fetch("http://localhost:8000/web/api-token-auth/", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid credentials.");
        }
      })
      .then((data) => setLogin({ token: data.token, id: data.id }))

      // Catch errors.
      // Replace 'Failed to fetch' with more meaningful message.
      .catch((error) => {
        const message =
          error.message === "Failed to fetch"
            ? "Server unreachable."
            : error.message;
        setErrorMessage(message);
      });
  }, [setErrorMessage, setLogin, username, password]);

  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Pane className={styles.container}>
          <h1 className={styles.title}>Nature View</h1>
          <TextInput
            className={styles.input}
            name="username-input"
            placeholder="username"
            value={username}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setUsername(e.currentTarget.value)
            }
          />
          <TextInput
            className={styles.input}
            name="password-input"
            placeholder="password"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
          />
          <h1 className={styles.errorMessage}>{errorMessage}</h1>
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

export default connector(Login);
