import ImageSlider from '@components/_common/image-slider/ImageSlider';

interface NoteImageListProps {
  images: string[];
}

function NoteImageList({ images }: NoteImageListProps) {
  if (!images.length) return null;
  return <ImageSlider images={images} />;
}

export default NoteImageList;
