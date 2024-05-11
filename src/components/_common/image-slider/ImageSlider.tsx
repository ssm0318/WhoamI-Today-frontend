import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Layout, SvgIcon, Typo } from '@design-system';
import { Border } from 'src/design-system/layouts/layout.types';
import * as S from './ImageSlider.styled';

interface ImageSliderProps extends Border {
  images: string[];
  onDeleteImage?: (imgIndex: number) => void;
}

function ImageSlider({ images, onDeleteImage, ...borderStyleProps }: ImageSliderProps) {
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

  const isEditMode = !!onDeleteImage;

  const handleDeleteImage = (imgIndex: number) => {
    onDeleteImage?.(imgIndex);
    setCurrentIndex(0);
  };

  return (
    <S.ImageSliderWrapper {...handlers}>
      <Layout.FlexRow justifyContent="center">
        <S.ImageWrapper bgColor="MEDIUM_GRAY" {...borderStyleProps}>
          {images[currentIndex] && (
            <S.Image src={images[currentIndex]} alt="slide-img" isEditMode={isEditMode} />
          )}
          <Layout.Absolute t={6} {...(isEditMode ? { l: 8 } : { l: 6 })}>
            <Layout.FlexRow bgColor="DARK" ph={4} pv={2} rounded={12}>
              <Typo type="label-small" color="LIGHT">
                {currentIndex + 1}/{images.length}
              </Typo>
            </Layout.FlexRow>
          </Layout.Absolute>
          {isEditMode && (
            <Layout.Absolute t={0} r={0}>
              <SvgIcon
                name="delete_image"
                size={50}
                onClick={() => {
                  handleDeleteImage(currentIndex);
                }}
              />
            </Layout.Absolute>
          )}
        </S.ImageWrapper>
      </Layout.FlexRow>
      {/* indicator */}
      <Layout.FlexRow w="100%" justifyContent="center" mv={10}>
        {images.map((img, index) => (
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
