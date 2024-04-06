import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Layout, Typo } from '@design-system';
import * as S from './ImageSlider.styled';

interface ImageSliderProps {
  image: string[];
  width: number;
  height: number;
}

function ImageSlider({ image, width, height }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : image.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < image.length - 1 ? prevIndex + 1 : 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

  return (
    <S.ImageSliderWrapper {...handlers}>
      <Layout.FlexRow justifyContent="center">
        <S.ImageWrapper w={width} h={height} bgColor="MEDIUM_GRAY">
          {image[currentIndex] && <S.Image src={image[currentIndex]} alt="slide-img" />}
          {/* current index */}
          <Layout.Absolute t={6} r={6}>
            <Layout.FlexRow bgColor="GRAY_4" ph={4} pv={2} rounded={12}>
              <Typo type="label-small" color="LIGHT">
                {currentIndex + 1}/{image.length}
              </Typo>
            </Layout.FlexRow>
          </Layout.Absolute>
        </S.ImageWrapper>
      </Layout.FlexRow>
      {/* indicator */}
      <Layout.FlexRow w="100%" justifyContent="center" mv={10}>
        {image.map((img, index) => (
          <S.IndicatorItem
            key={img + index.toString()}
            w={6}
            h={6}
            rounded={3}
            mr={4}
            bgColor={currentIndex === index ? 'PRIMARY' : 'LIGHT_GRAY'}
            isActive={currentIndex === index}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Layout.FlexRow>
    </S.ImageSliderWrapper>
  );
}

export default ImageSlider;
