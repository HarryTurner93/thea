import { LoginState } from '../../login/loginSlice';
import { API_URL } from '../../../config';

export function getCameras(login: LoginState) {
  console.log('Get Cameras!');
  return new Promise<any>((resolve) => {
    const options = {
      headers: new Headers({ Authorization: `Token ${login.token}` }),
    };
    fetch(`${API_URL}/cameras/`, options)
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          throw new Error('Bad response.');
        }
      })
      .catch((error) => console.log(error));
  });
}

export function postCamera(login: LoginState, name: string, longitude: number, latitude: number) {
  return new Promise<any>((resolve) => {
    // Try and create camera in backend.
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
      body: JSON.stringify({
        name,
        longitude,
        latitude,
        user: login.id,
      }),
    };

    fetch(`${API_URL}/cameras/`, requestOptions)
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          throw new Error("Couldn't post camera.");
        }
      })
      .then((data) => resolve(data))
      .catch((error) => console.log(error));
  });
}

export function deleteCamera(login: LoginState, cameraID: number) {
  return new Promise<void>((resolve) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
    };
    fetch(`${API_URL}/cameras/${cameraID}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          throw new Error('Bad response.');
        }
      })
      .catch((error) => console.log(error));
  });
}
