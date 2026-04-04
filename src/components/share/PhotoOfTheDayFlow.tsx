import { ChangeEvent, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import NewNoteImageEdit from '@components/note/new-note-image-edit/NewNoteImageEdit';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import { PostVisibility, ShareType } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { postNote } from '@utils/apis/note';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../../routes/Root';

type Step = 'pick' | 'edit' | 'caption';

function PhotoOfTheDayFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const imageFromState = (location.state as any)?.imageDataUrl as string | undefined;
  const openToast = useBoundStore((state) => state.openToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(imageFromState ? 'edit' : 'pick');
  const [rawImageUrl, setRawImageUrl] = useState<string | undefined>(imageFromState);
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<ComponentVisibility>(ComponentVisibility.FRIENDS);
  const [isPosting, setIsPosting] = useState(false);

  const handlePickGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    try {
      const dataUrl = await readFile(e.target.files[0]);
      if (typeof dataUrl !== 'string') return;
      setRawImageUrl(dataUrl);
      setStep('edit');
    } catch {
      openToast({ message: 'Failed to load image' });
    }
  };

  const handleCropComplete = (img: CroppedImg) => {
    setCroppedImg(img);
    setStep('caption');
  };

  const handlePost = async () => {
    if (!croppedImg || isPosting) return;
    setIsPosting(true);
    try {
      await postNote({
        content: caption,
        images: [croppedImg],
        visibility: [visibility as unknown as PostVisibility],
        share_type: ShareType.PHOTO_OF_THE_DAY,
      });
      openToast({ message: 'Photo posted!' });
      navigate('/share');
    } catch {
      openToast({ message: 'Failed to post' });
    } finally {
      setIsPosting(false);
    }
  };

  // Step 1: Camera/Gallery choice
  if (step === 'pick') {
    return (
      <MainScrollContainer>
        <SubHeader title="Photo of the Day" />
        <Layout.FlexCol
          w="100%"
          alignItems="center"
          justifyContent="center"
          style={{ flex: 1 }}
          pv={60}
          gap={24}
          ph={24}
        >
          <Typo type="title-large" textAlign="center">
            Share a moment from your day
          </Typo>
          <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
            Pick a photo from your gallery
          </Typo>
          <Layout.FlexCol w="100%" gap={12}>
            <PickButton onClick={handlePickGallery}>
              <Typo type="title-medium" color="WHITE">
                Choose from Gallery
              </Typo>
            </PickButton>
          </Layout.FlexCol>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileSelected}
            style={{ display: 'none' }}
          />
        </Layout.FlexCol>
      </MainScrollContainer>
    );
  }

  // Step 2: Crop/edit
  if (step === 'edit' && rawImageUrl) {
    return (
      <NewNoteImageEdit
        imageUrl={rawImageUrl}
        setIsVisible={(visible) => {
          if (!visible) setStep('pick');
        }}
        onCompleteImageCrop={handleCropComplete}
      />
    );
  }

  // Step 3: Caption + visibility + post
  return (
    <MainScrollContainer>
      <SubHeader
        title="Add a caption"
        RightComponent={
          <button type="button" onClick={handlePost} disabled={isPosting}>
            <Typo type="title-medium" color={isPosting ? 'LIGHT_GRAY' : 'PRIMARY'}>
              Post
            </Typo>
          </button>
        }
      />
      <Layout.FlexCol w="100%" ph={16} pv={12} gap={16}>
        {/* Photo preview — hero */}
        {croppedImg?.url && (
          <PhotoPreview>
            <img src={croppedImg.url} alt="Preview" />
          </PhotoPreview>
        )}

        {/* Caption input */}
        <CaptionInput
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          maxLength={300}
          rows={3}
        />

        {/* Visibility */}
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
          <Typo type="label-large" color="DARK_GRAY">
            Who can see this
          </Typo>
          <VisibilityToggle value={visibility} onChange={setVisibility} />
        </Layout.FlexRow>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

const PickButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.PRIMARY};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoPreview = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.LIGHT};

  img {
    width: 100%;
    display: block;
    object-fit: cover;
    max-height: 400px;
  }
`;

const CaptionInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 24px;
  resize: none;
  font-family: inherit;
  color: #333;
  box-sizing: border-box;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT_GRAY};

  &::placeholder {
    color: #bdbdbd;
  }
`;

export default PhotoOfTheDayFlow;
