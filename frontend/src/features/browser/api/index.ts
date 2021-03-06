// A mock function to mimic making an async request for data
import { LoginState } from '../../login/loginSlice';
import { Image } from '../types';
import { API_URL } from '../../../config';

export function getImages(
  login: LoginState,
  cameraID: number,
  page: number,
  orderBy: string | number | boolean
) {
  return new Promise<{ pages: number; images: Image[] }>((resolve) => {
    // Try and create camera in backend.
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${login.token}`,
      },
    };

    fetch(
      `${API_URL}/images/?camera_id=${cameraID}&page=${page}&ordering=-${orderBy}`,
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
