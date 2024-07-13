import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { NOTE_IMAGE_CROP_HEIGHT, NOTE_IMAGE_CROP_WIDTH } from '@constants/size';
import { Typo } from '@design-system';
import getCroppedImg, { CROP_MIN_ZOOM, CroppedImg } from '@utils/getCroppedImg';

const cropContainerStyle = {
  backgroundColor: '#7F7F7F',
};

interface ProfileImageEditProps {
  setIsVisible: (visible: boolean) => void;
  image?: string;
  onCompleteImageCrop: (img: CroppedImg) => void;
}

function NoteImageEdit({ image, setIsVisible, onCompleteImageCrop }: ProfileImageEditProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<CroppedImg>();

  const showCroppedImage = useCallback(
    async (_: Area, areaPixels: Area) => {
      if (!image || !areaPixels) return;

      try {
        const croppedImg = await getCroppedImg(image, areaPixels);
        setCroppedImage(croppedImg);
      } catch (error) {
        console.error(error);
      }
    },
    [image],
  );

  const handleClickComplete = () => {
    if (!croppedImage) return;
    onCompleteImageCrop(croppedImage);
    setIsVisible(false);
  };

  const handleClickCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <SubHeader
        title={t('crop_photo')}
        LeftComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="title-medium">{t('cancel')}</Typo>
          </button>
        }
        RightComponent={
          <button type="button" onClick={handleClickComplete}>
            <Typo type="title-medium" color="PRIMARY">
              {t('done')}
            </Typo>
          </button>
        }
        typo="title-large"
      />
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        minZoom={CROP_MIN_ZOOM}
        restrictPosition={false}
        showGrid
        cropSize={{ width: NOTE_IMAGE_CROP_WIDTH, height: NOTE_IMAGE_CROP_HEIGHT }}
        onCropChange={setCrop}
        onCropComplete={showCroppedImage}
        onZoomChange={setZoom}
        style={{ containerStyle: cropContainerStyle }}
      />
    </>
  );
}

export default NoteImageEdit;
