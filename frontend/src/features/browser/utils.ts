import { Image } from './types';

export function noScores(image: Image) {
  return image.fox === 0;
}
