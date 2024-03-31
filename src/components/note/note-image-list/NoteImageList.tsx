import ImageSlider from '@components/_common/image-slider/ImageSlider';
import { SCREEN_WIDTH } from '@constants/layout';

interface NoteImageListProps {
  images: string[];
}

function NoteImageList({ images }: NoteImageListProps) {
  return <ImageSlider images={images} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />;
}

export const IMAGE_RATIO = 180 / 327;
export const IMAGE_WIDTH = SCREEN_WIDTH - 12 * 4;
export const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_RATIO;

export default NoteImageList;
