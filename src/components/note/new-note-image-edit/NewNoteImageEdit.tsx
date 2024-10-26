import { SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { centerCrop, PixelCrop } from 'react-image-crop';
import SubHeader from '@components/sub-header/SubHeader';
import { NOTE_IMAGE_CROP_MIN_SIZE } from '@constants/size';
import { Layout, Typo } from '@design-system';
import { CroppedImg, getReactImageCrop } from '@utils/getCroppedImg';
// NOTE: 이렇게 css 를 직접 로드하지 않으면 로드가 안됨... 확인 필요
import 'react-image-crop/dist/ReactCrop.css';
import { StyledNewNoteImage, StyledNewNoteImageWrapper } from './NewNoteImageEdit.styled';

interface NewNoteImageEditProps {
  setIsVisible: (visible: boolean) => void;
  imageUrl?: string;
  onCompleteImageCrop: (img: CroppedImg) => void;
}

function NewNoteImageEdit({ setIsVisible, imageUrl, onCompleteImageCrop }: NewNoteImageEditProps) {
  const [t] = useTranslation('translation');

  const imgRef = useRef<HTMLImageElement>(null);

  const [crop, setCrop] = useState<PixelCrop>();
  const [completeImg, setCompleteImg] = useState<CroppedImg>();

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    setCrop(
      centerCrop(
        {
          unit: 'px', // Can be 'px' or '%'
          width,
          height,
        },
        width,
        height,
      ),
    );
  };

  const onImageCropChange = (pixelCrop: PixelCrop) => {
    setCrop(pixelCrop);
  };

  const handleClickComplete = async () => {
    if (!imageUrl || !imgRef.current || !crop) {
      throw new Error('Crop canvas does not exist');
    }

    try {
      const croppedImg = await getReactImageCrop(imgRef.current, crop);
      setCompleteImg(croppedImg);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickCancel = () => {
    setIsVisible(false);
  };

  const handleClickCheck = () => {
    if (!completeImg) return;

    setIsVisible(false);
    onCompleteImageCrop(completeImg);
  };

  return (
    <Layout.AbsoluteFullScreen bgColor="DARK">
      {completeImg ? (
        <>
          {/* 크롭 완료된 이미지 미리보기 */}
          <SubHeader
            RightComponent={
              <button type="button" onClick={handleClickCheck}>
                <Typo type="title-large" color="PRIMARY">
                  이미지 확인 완료
                </Typo>
              </button>
            }
            onGoBack={handleClickCancel}
          />
          <StyledNewNoteImageWrapper>
            <StyledNewNoteImage src={completeImg.url} />
          </StyledNewNoteImageWrapper>
        </>
      ) : (
        imageUrl && (
          <>
            {/* 이미지 크롭 */}
            <SubHeader
              title={t('sign_up.crop_picture')}
              RightComponent={
                <button type="button" onClick={handleClickComplete}>
                  <Typo type="title-large" color="PRIMARY">
                    {t('common.done')}
                  </Typo>
                </button>
              }
              onGoBack={handleClickCancel}
            />
            <StyledNewNoteImageWrapper>
              <ReactCrop
                crop={crop}
                minHeight={NOTE_IMAGE_CROP_MIN_SIZE}
                minWidth={NOTE_IMAGE_CROP_MIN_SIZE}
                onChange={onImageCropChange}
              >
                <StyledNewNoteImage ref={imgRef} src={imageUrl} onLoad={onImageLoad} />
              </ReactCrop>
            </StyledNewNoteImageWrapper>
          </>
        )
      )}
    </Layout.AbsoluteFullScreen>
  );
}

export default NewNoteImageEdit;
