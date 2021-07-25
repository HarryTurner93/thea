// A mock function to mimic making an async request for data
import { LoginState } from '../../login/loginSlice';
import { Camera } from '../types';
import { API_URL } from '../../../config';

export function getCameras(login: LoginState) {
  return new Promise<Camera[]>((resolve) => {
    const options = {
      headers: new Headers({ Authorization: `Token ${login.token}` }),
    };
    fetch(`${API_URL}/cameras/`, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Bad response.');
        }
      })
      .catch((error) => console.log(error));
  });
}
