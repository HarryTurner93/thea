import { Button, Pane, TextInput } from 'evergreen-ui';
import React, { useCallback, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';

import { AppDispatch } from '../../app/store';

import styles from './Login.module.css';
import { LoginState, setLogin } from './loginSlice';
import { login } from './api';

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLogin: (token: LoginState) => dispatch(setLogin(token)),
});
const connector = connect(null, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Login({ setLogin }: Props) {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleClick = useCallback(() => {
    // Reset error message.
    setErrorMessage('');

    // Attempt to login.
    login(username, password).then((data) => {
      data.error ? setErrorMessage(data.error) : setLogin({ token: data.token, id: data.id });
    });
  }, [setErrorMessage, setLogin, username, password]);

  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Pane className={styles.container}>
          <h1 className={styles.title}>Thea</h1>
          <TextInput
            className={styles.input}
            data-name="username"
            name="username-input"
            placeholder="username"
            value={username}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setUsername(e.currentTarget.value)}
          />
          <TextInput
            className={styles.input}
            data-name="password"
            name="password-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
          />
          <h1 className={styles.errorMessage}>{errorMessage}</h1>
          <Button
            className={styles.button}
            data-name="submit"
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
