import { LoginState } from '../../login/loginSlice';

export function fetchCount(login: LoginState, cameraID: number) {
  return new Promise<{ count: number }>((resolve) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
    };
    fetch(`http://localhost:8000/web/cameras/${cameraID}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Couldn't get count.");
        }
      })
      .then((data) => {
        resolve({ count: data.image_count });
      })
      .catch((error) => console.log(error));
  });
}
