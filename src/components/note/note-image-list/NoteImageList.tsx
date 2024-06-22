import ImageSlider from '@components/_common/image-slider/ImageSlider';

interface NoteImageListProps {
  images: string[];
}

function NoteImageList({ images }: NoteImageListProps) {
  console.log('img', images);
  if (!images.length) return null;
  return <ImageSlider images={images} />;
}

export default NoteImageList;
