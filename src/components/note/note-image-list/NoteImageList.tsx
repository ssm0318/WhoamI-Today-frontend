import ImageSlider from '@components/_common/image-slider/ImageSlider';
import { Layout } from '@design-system';

interface NoteImageListProps {
  images: string[];
}

function NoteImageList({ images }: NoteImageListProps) {
  if (!images.length) return null;
  return (
    <Layout.FlexRow w="100%" mv={10}>
      <ImageSlider images={images} />
    </Layout.FlexRow>
  );
}

export default NoteImageList;
