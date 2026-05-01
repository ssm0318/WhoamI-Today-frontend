import { SyntheticEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
      const displayPixelCrop: PixelCrop =
        crop.unit === 'px'
          ? (crop as PixelCrop)
          : {
              unit: 'px',
              x: (crop.x / 100) * imgRef.current.width,
              y: (crop.y / 100) * imgRef.current.height,
              width: (crop.width / 100) * imgRef.current.width,
              height: (crop.height / 100) * imgRef.current.height,
            };
      // eslint-disable-next-line no-console
      console.log(
        '[CropDebug]',
        JSON.stringify({
          imageUrlPrefix: imageUrl.slice(0, 60),
          imageUrlLength: imageUrl.length,
          natural: { w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight },
          display: { w: imgRef.current.width, h: imgRef.current.height },
          devicePixelRatio: window.devicePixelRatio,
          crop,
          displayPixelCrop,
        }),
      );
      const img = await getReactImageCrop(imgRef.current, displayPixelCrop);
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

  // iOS WebView 의 -webkit-overflow-scrolling: touch (MainScrollContainer) 안에서는
  // position: fixed 가 viewport 가 아니라 스크롤 컨테이너 기준으로 잡히는 webkit 이슈가 있어서
  // 컨테이너 자체를 #modal-container (RootContainer 밖, body 직속) 로 portal 해서
  // 항상 viewport 기준으로 풀스크린이 되도록 함. SubHeader 가 같은 패턴을 사용함.
  const portalTarget =
    typeof document !== 'undefined'
      ? document.getElementById('modal-container') ?? document.body
      : null;

  const content = (
    <StyledNoteImageEditContainer bgColor="DARK">
      {croppedImg ? (
        <>
          <SubHeader
            title={t('crop_photo')}
            disablePortal
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
              disablePortal
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

  return portalTarget ? createPortal(content, portalTarget) : content;
}

export default NewNoteImageEdit;
