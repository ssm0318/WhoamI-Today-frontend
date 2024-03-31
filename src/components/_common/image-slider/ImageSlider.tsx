import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Layout, Typo } from '@design-system';

interface ImageSliderProps {
  images: string[];
  width: number;
  height: number;
}

function ImageSlider({ images, width, height }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

  return (
    <Layout.FlexCol {...handlers} style={{ touchAction: 'none' }}>
      <Layout.FlexRow justifyContent="center">
        <Layout.FlexRow
          w={width}
          h={height}
          bgColor="MEDIUM_GRAY"
          style={{
            position: 'relative',
          }}
        >
          {images[currentIndex] && (
            <img
              src={images[currentIndex]}
              alt="slide-img"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {/* current index */}
          <Layout.Absolute t={6} r={6}>
            <Layout.FlexRow bgColor="GRAY_4" ph={4} pv={2} rounded={12}>
              <Typo type="label-small" color="LIGHT">
                {currentIndex + 1}/{images.length}
              </Typo>
            </Layout.FlexRow>
          </Layout.Absolute>
        </Layout.FlexRow>
      </Layout.FlexRow>
      {/* indicator */}
      <Layout.FlexRow w="100%" justifyContent="center" mv={10}>
        {images.map((image, index) => (
          <Layout.LayoutBase
            key={image + index.toString()}
            w={6}
            h={6}
            rounded={3}
            mr={4}
            bgColor={currentIndex === index ? 'PRIMARY' : 'LIGHT_GRAY'}
            style={{
              opacity: currentIndex === index ? 1 : 0.5,
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default ImageSlider;
