import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { NewNoteForm } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import ConnectionTypeOption from '../connection-type/ConnectionTypeOption';
import NewNoteImageEdit from '../new-note-image-edit/NewNoteImageEdit';
import { NoteImage, NoteImageWrapper } from '../note-image/NoteImage.styled';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
}

function NewNoteContent({ noteInfo, setNoteInfo }: NoteInformationProps) {
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [connectionType, setConnectionType] = useState(noteInfo.visibility);

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);

  const [editImageUrl, setEditImageUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const onClickAdd = () => {
    if (noteInfo.images && noteInfo.images.length < 10) inputRef.current?.click();
    // TODO: exception message
    else console.log('exceed 10 images');
  };

  const onImageAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const image = e.target.files[0];
    try {
      const imageDataUrl = await readFile(image);

      if (typeof imageDataUrl !== 'string') {
        throw new Error('read file error');
      }
      setEditImageUrl(imageDataUrl);
      setIsEditVisible(true);
    } catch (error) {
      openToast({
        message: (error as Error).message,
      });
    }
  };

  const visibilityUpdate = () => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      visibility: connectionType,
    }));
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [croppedImage],
    }));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      content: e.target.value,
    }));
  };

  const handleDeleteImage = () => {
    if (!noteInfo.images) return;

    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [],
    }));
  };

  const handleClickChangeConnection = async () => {
    setShowEditConnectionsModal(true);
  };
  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  return (
    <>
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
        <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
          <ProfileImage
            imageUrl={myProfile?.profile_image}
            username={myProfile?.username}
            size={50}
          />
          <Typo type="title-medium">{myProfile?.username}</Typo>
        </Layout.FlexRow>
        <NoteInput
          value={noteInfo.content}
          placeholder={`${t('notes.whats_on_your_mind')}\n\n${t('notes.content_restriction')}`}
          onChange={handleChangeInput}
        />
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
          {/** connections */}
          <Layout.FlexRow>
            <Layout.FlexRow
              onClick={handleClickChangeConnection}
              bgColor="SECONDARY"
              pl={10}
              pr={8}
              pv={5}
              rounded={8}
              gap={5}
              alignItems="center"
              justifyContent="center"
            >
              <Typo type="label-large" color="BLACK">
                {connectionType === 'close_friends'
                  ? t('user_page.connection.close_friend')
                  : t('user_page.connection.friend')}
              </Typo>
              <Icon name="chevron_down" size={18} color="BLACK" />
            </Layout.FlexRow>
            {showEditConnectionsModal && (
              <ConnectionTypeOption
                type={connectionType}
                setType={setConnectionType}
                visibilityUpdate={visibilityUpdate}
                visible={showEditConnectionsModal}
                closeBottomSheet={closeEditConnectionsModal}
              />
            )}
          </Layout.FlexRow>{' '}
        </Layout.FlexRow>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={onImageAdd}
          multiple={false}
          style={{ display: 'none' }}
        />
      </Layout.FlexCol>
      {isEditVisible ? (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      ) : noteInfo?.images?.length ? (
        <NoteImageWrapper ph={DEFAULT_MARGIN}>
          {noteInfo.images[0] && <NoteImage src={noteInfo.images[0].url} />}
          <Layout.Absolute t={0} r={15}>
            <SvgIcon name="delete_image" size={50} onClick={handleDeleteImage} />
          </Layout.Absolute>
        </NoteImageWrapper>
      ) : null}
    </>
  );
}

export default NewNoteContent;
