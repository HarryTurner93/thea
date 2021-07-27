import { LoginState } from '../../login/loginSlice';
import { API_URL, S3_URL } from '../../../config';
import { Camera } from '../../map/types';

export function fetchCameraInfo(login: LoginState, cameraID: number) {
  return new Promise<Camera>((resolve) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
    };
    fetch(`${API_URL}/cameras/${cameraID}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          throw new Error("Couldn't get count.");
        }
      })
      .catch((error) => console.log(error));
  });
}

export function putFile(login: LoginState, file: File, cameraID: number, name: string) {
  return new Promise<void>((resolve) => {
    // Post data.
    const formData = new FormData();
    formData.append('File', file, name);

    fetch(`${S3_URL}/images/${name}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Couldn't put to S3.");
        }
      })
      .then(() => {
        // Try and create camera in backend.
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${login.token}`,
          },
          body: JSON.stringify({
            object_key: name,
            camera: cameraID,
          }),
        };

        fetch(`${API_URL}/images/`, requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Couldn't post camera.");
            }
          })
          .then(() => resolve())
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  });
}
