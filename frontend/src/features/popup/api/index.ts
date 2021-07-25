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

export function putFile(login: LoginState, file: File, cameraID: number, name: string) {
  return new Promise<void>((resolve) => {
    // Post data.
    const formData = new FormData();
    formData.append('File', file, name);

    fetch(`http://localstack:4566/images/${name}`, {
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

        fetch('http://localhost:8000/web/images/', requestOptions)
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
