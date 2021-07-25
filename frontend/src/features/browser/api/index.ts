// A mock function to mimic making an async request for data
import { LoginState } from '../../login/loginSlice';
import { ImageInfo } from '../types';

export function getImages(
  login: LoginState,
  cameraID: number,
  page: number,
  orderBy: string | number | boolean
) {
  return new Promise<{ pages: number; images: ImageInfo[] }>((resolve) => {
    // Try and create camera in backend.
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
    };

    fetch(
      `http://localhost:8000/web/images/?camera_id=${cameraID}&page=${page}&ordering=-${orderBy}`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Couldn't post camera.");
        }
      })
      .then((data) =>
        resolve({
          pages: Math.ceil(data.count / 6),
          images: data.results,
        })
      )
      .catch((error) => console.log(error));
  });
}
