import { SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import SubHeader from '@components/sub-header/SubHeader';
import { NOTE_IMAGE_CROP_MIN_SIZE } from '@constants/size';
import { Typo } from '@design-system';
import { CroppedImg, getReactImageCrop } from '@utils/getCroppedImg';
import 'react-image-crop/dist/ReactCrop.css';
import {
  AspectButton,
  AspectRatioBar,
  StyledNewNoteImage,
  StyledNewNoteImageWrapper,
  StyledNoteImageEditContainer,
} from './NewNoteImageEdit.styled';

interface NewNoteImageEditProps {
  setIsVisible: (visible: boolean) => void;
  imageUrl?: string;
  onCompleteImageCrop: (img: CroppedImg) => void;
}

const ASPECT_PRESETS: { label: string; value: number | undefined }[] = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: 1 },
  { label: '9:16', value: 9 / 16 },
  { label: '3:4', value: 3 / 4 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
];

function NewNoteImageEdit({ setIsVisible, imageUrl, onCompleteImageCrop }: NewNoteImageEditProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const imgRef = useRef<HTMLImageElement>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedImg, setCroppedImage] = useState<CroppedImg>();

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgDimensions({ width, height });

    setCrop(centerCrop({ unit: 'px', width, height }, width, height));
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (!imgDimensions.width || !imgDimensions.height) return;

    if (newAspect) {
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          newAspect,
          imgDimensions.width,
          imgDimensions.height,
        ),
        imgDimensions.width,
        imgDimensions.height,
      );
      setCrop(newCrop);
    } else {
      setCrop(
        centerCrop(
          { unit: 'px', width: imgDimensions.width, height: imgDimensions.height },
          imgDimensions.width,
          imgDimensions.height,
        ),
      );
    }
  };

  const onImageCropChange = (_: PixelCrop, percentCrop: Crop) => {
    setCrop(percentCrop);
  };

  const handleCropDone = async () => {
    if (!imageUrl || !imgRef.current || !crop) return;

    try {
      // Convert percentage crop to pixel crop for the actual cropping
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (crop.x / 100) * imgRef.current.naturalWidth,
        y: (crop.y / 100) * imgRef.current.naturalHeight,
        width: (crop.width / 100) * imgRef.current.naturalWidth,
        height: (crop.height / 100) * imgRef.current.naturalHeight,
      };
      if (crop.unit === 'px') {
        pixelCrop.x = crop.x;
        pixelCrop.y = crop.y;
        pixelCrop.width = crop.width;
        pixelCrop.height = crop.height;
      }
      const img = await getReactImageCrop(imgRef.current, pixelCrop);
      setCroppedImage(img);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleClickCancel = () => {
    setIsVisible(false);
  };

  const handleClickCheck = () => {
    if (!croppedImg) return;
    setIsVisible(false);
    onCompleteImageCrop(croppedImg);
  };

  return (
    <StyledNoteImageEditContainer bgColor="DARK">
      {croppedImg ? (
        <>
          <SubHeader
            title={t('crop_photo')}
            RightComponent={
              <button type="button" onClick={handleClickCheck}>
                <Typo type="title-large" color="PRIMARY">
                  {t('confirm')}
                </Typo>
              </button>
            }
            onGoBack={handleClickCancel}
          />
          <StyledNewNoteImageWrapper>
            <StyledNewNoteImage src={croppedImg.url} />
          </StyledNewNoteImageWrapper>
        </>
      ) : (
        imageUrl && (
          <>
            <SubHeader
              title={t('crop_photo')}
              RightComponent={
                <button type="button" onClick={handleCropDone}>
                  <Typo type="title-large" color="PRIMARY">
                    {t('done')}
                  </Typo>
                </button>
              }
              onGoBack={handleClickCancel}
            />
            <StyledNewNoteImageWrapper>
              <ReactCrop
                crop={crop}
                aspect={aspect}
                minHeight={NOTE_IMAGE_CROP_MIN_SIZE}
                minWidth={NOTE_IMAGE_CROP_MIN_SIZE}
                onChange={onImageCropChange}
              >
                <StyledNewNoteImage ref={imgRef} src={imageUrl} onLoad={onImageLoad} />
              </ReactCrop>
            </StyledNewNoteImageWrapper>
            <AspectRatioBar>
              {ASPECT_PRESETS.map((preset) => (
                <AspectButton
                  key={preset.label}
                  $isSelected={aspect === preset.value}
                  onClick={() => handleAspectChange(preset.value)}
                >
                  {preset.label}
                </AspectButton>
              ))}
            </AspectRatioBar>
          </>
        )
      )}
    </StyledNoteImageEditContainer>
  );
}

export default NewNoteImageEdit;
