import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { Typo } from '@design-system';
import getCroppedImg, { CroppedImg } from '@utils/getCroppedImg';

const cropContainerStyle = {
  width: '100%',
  backgroundColor: '#7F7F7F',
};

const cropAreaStyle = {
  content: '',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%,-50%,0)',
  backgroundColor: 'transparent',
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
          <button type="button" onClick={handleClickComplete}>
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
        onGoBack={handleClickCancel}
      />
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        cropSize={{ height: 250, width: 450 }}
        aspect={1}
        showGrid
        onCropChange={setCrop}
        onCropComplete={showCroppedImage}
        onZoomChange={setZoom}
        objectFit="horizontal-cover"
        style={{
          containerStyle: cropContainerStyle,
          cropAreaStyle,
        }}
      />
    </>
  );
}

export default NoteImageEdit;
