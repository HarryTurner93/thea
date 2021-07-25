import { Image } from './types';

export function noScores(image: Image) {
  return image ? image.fox === 0 : false;
}
