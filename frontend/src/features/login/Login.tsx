import React, {useCallback, useState} from "react";
import { ConnectedProps, connect } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { Button, Pane, TextInput } from "evergreen-ui"
import { setToken } from "./loginSlice";

import styles from "./Login.module.css";

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLogin: (token: string) => dispatch(setToken(token)),
});
const connector = connect(null, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Login({ setLogin }: Props) {
  const [errorMessage, setErrorMessage] = useState("")

  const handleClick = useCallback(() => {

    // Reset error message.
    setErrorMessage("")

    // Attempt to login.
    // Todo: Credentials passed via inputs.
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'harry',
          password: '4loaseheb4'
        })
    };
    // Todo: Move this to environment variable.
    fetch('http://localhost:8000/api-token-auth/', requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Invalid credentials.");
        }
      })
      .then(data => setLogin(data.token))

      // Catch errors.
      // Replace 'Failed to fetch' with more meaningful message.
      .catch((error) => {
        const message = error.message === 'Failed to fetch' ? 'Server unreachable.' : error.message
        setErrorMessage(message)
      })

  }, [setErrorMessage, setLogin]);

  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Pane className={styles.container}>
          <p>{errorMessage}</p>
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

export default connector(Login);
