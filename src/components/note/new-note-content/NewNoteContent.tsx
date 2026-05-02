import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { Mission } from '@components/share/MissionOfTheDay';
import { DEFAULT_MARGIN } from '@constants/layout';
import { CheckBox, Colors, Layout, SvgIcon, Typo } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { useMissionToday } from '@hooks/useMissionToday';
import { NoteDraftContext, useNoteDraft } from '@hooks/useNoteDraft';
import { FileSelectedData } from '@models/app';
import { ComponentVisibility } from '@models/checkIn';
import { NewNoteForm, PostVisibility } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { processImageFromApp } from '@utils/imageHelpers';
import { setLastVisibility, VisibilityMemoryKeys } from '@utils/visibilityMemory';
import { FlexRow } from 'src/design-system/layouts';
import NewNoteImageEdit from '../new-note-image-edit/NewNoteImageEdit';
import NewNotePhotoUploadBottomSheet from '../new-note-photo-upload-bottom-sheet/NewNotePhotoUploadBottomSheet';
import { NoteImage } from '../note-image/NoteImage.styled';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
  autoOpenImagePicker?: boolean;
  placeholder?: string;
  missionMode?: boolean;
  mission?: Mission;
  isEditing?: boolean;
}

const DRAFT_DEBOUNCE_MS = 500;

function NewNoteContent({
  noteInfo,
  setNoteInfo,
  autoOpenImagePicker,
  placeholder,
  missionMode,
  mission,
  isEditing,
}: NoteInformationProps) {
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const { featureFlags } = useBoundStore(UserSelector);

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [showPhotoUploadBottomSheet, setShowPhotoUploadBottomSheet] = useState(false);

  const [editImageUrl, setEditImageUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);
  const { isAndroid } = getMobileDeviceInfo();
  const postMessage = usePostAppMessage();
  const hasAutoOpenedRef = useRef(false);

  // Mission-mode helper: read the current attempt count for the inline
  // "Attempt N/5" label. Reads from cache via useMissionToday's SWR key.
  const { mission: missionToday } = useMissionToday();
  const upcomingAttemptNumber = missionMode ? (missionToday?.attempts_used ?? 0) + 1 : null;
  const attemptsRemaining = missionToday?.attempts_remaining ?? 5;

  // Draft persistence — autosave on text/visibility change, hydrate on mount.
  // Disabled in edit mode (the existing note IS the source of truth).
  const draftContext: NoteDraftContext = missionMode ? 'mission' : 'regular';
  const {
    draft,
    save: saveDraft,
    hydrated,
  } = useNoteDraft(draftContext, mission?.id ?? null, { disabled: !!isEditing });
  const draftHydratedRef = useRef(false);
  useEffect(() => {
    if (!hydrated || draftHydratedRef.current || isEditing) return;
    draftHydratedRef.current = true;
    if (draft && (draft.content || draft.visibility.length > 0)) {
      setNoteInfo((prev) => ({
        ...prev,
        content: draft.content || prev.content,
        visibility: draft.visibility.length > 0 ? draft.visibility : prev.visibility,
      }));
    }
  }, [hydrated, draft, isEditing, setNoteInfo]);

  // Debounced autosave: re-arm a timer on each change; latest wins. Skips
  // edit mode and waits until hydration completes to avoid clobbering a
  // restored draft with the empty initial state.
  useEffect(() => {
    if (isEditing || !hydrated) return;
    const handle = window.setTimeout(() => {
      saveDraft({
        content: noteInfo.content ?? '',
        visibility: noteInfo.visibility ?? [],
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [noteInfo.content, noteInfo.visibility, isEditing, hydrated, saveDraft]);

  useEffect(() => {
    if (autoOpenImagePicker && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      // Delay slightly to ensure DOM is ready
      const timer = setTimeout(() => onClickAdd(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoOpenImagePicker]); // eslint-disable-line react-hooks/exhaustive-deps

  // 앱에서 파일 선택 완료 시 호출되는 콜백
  const handleFileSelected = async (data: FileSelectedData) => {
    const result = await processImageFromApp(data, (message) => openToast({ message }));

    if (result) {
      setNoteInfo((prevNoteInfo) => ({
        ...prevNoteInfo,
        images: [result],
      }));
    }
  };

  // 앱에서 파일 선택 이벤트 리스닝
  useGetAppMessage({
    key: 'FILE_SELECTED',
    cb: handleFileSelected,
  });

  const onClickAdd = () => {
    /* Show camera/gallery choice for Photo of the Day or Android */
    if (isAndroid || autoOpenImagePicker) {
      setShowPhotoUploadBottomSheet(true);
      return;
    }

    if (noteInfo.images && noteInfo.images.length < 10) {
      inputRef.current?.click();
    } else {
      openToast({
        message: t('notes.max_images_error') || '최대 10장까지만 첨부할 수 있습니다',
      });
    }
  };

  const handleOpenCamera = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_CAMERA', {});
    } else {
      // On web, open file input (camera not available)
      inputRef.current?.click();
    }
  };

  const handleOpenAlbum = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_GALLERY', {});
    } else {
      inputRef.current?.click();
    }
  };

  const closePhotoUploadBottomSheet = () => {
    setShowPhotoUploadBottomSheet(false);
  };

  const onFileAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    try {
      const imageDataUrl = await readFile(file);

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

  const handleChangeVisibility = (visibilities: PostVisibility[]) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      visibility: visibilities,
    }));
    if (visibilities[0]) {
      setLastVisibility(
        VisibilityMemoryKeys.share.note,
        visibilities[0] as unknown as ComponentVisibility,
      );
    }
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

  const isPhotoFirst = featureFlags?.postsVerQ && !missionMode;

  const handleClickGallery = () => {
    if (noteInfo.images && noteInfo.images.length >= 10) {
      openToast({
        message: t('notes.max_images_error') || '최대 10장까지만 첨부할 수 있습니다',
      });
      return;
    }
    inputRef.current?.click();
  };

  const visibilityToggle = featureFlags?.postsVerQ ? (
    <Layout.FlexRow gap={6} alignItems="center">
      <CheckBox
        name={t('notes.close_friends_only') || 'Close friends only'}
        checked={noteInfo.visibility[0] === PostVisibility.CLOSE_FRIENDS}
        onChange={() =>
          handleChangeVisibility([
            noteInfo.visibility[0] === PostVisibility.CLOSE_FRIENDS
              ? myProfile?.is_public
                ? PostVisibility.PUBLIC
                : PostVisibility.FRIENDS
              : PostVisibility.CLOSE_FRIENDS,
          ])
        }
      />
    </Layout.FlexRow>
  ) : (
    <VisibilityToggle
      value={
        (noteInfo.visibility[0] as unknown as ComponentVisibility) || ComponentVisibility.FRIENDS
      }
      onChange={(v) => handleChangeVisibility([v as unknown as PostVisibility])}
    />
  );

  if (isPhotoFirst) {
    return (
      <>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={12} gap={16} pb={100}>
            {/* Profile row */}
            <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
              <ProfileImage
                imageUrl={myProfile?.profile_image}
                username={myProfile?.username}
                size={40}
              />
              <Typo type="title-medium">{myProfile?.username}</Typo>
            </Layout.FlexRow>

            {/* Photo selection area — below profile */}
            {noteInfo?.images && noteInfo.images.length > 0 && noteInfo.images[0]?.url ? (
              <PhotoFirstPreviewContainer>
                <PhotoFirstPreviewImage src={noteInfo.images[0].url} alt="Note image" />
                <Layout.Absolute t={8} r={8}>
                  <SvgIcon name="delete_image" size={32} onClick={handleDeleteImage} />
                </Layout.Absolute>
                <Layout.FlexRow
                  gap={8}
                  mt={12}
                  style={{ position: 'absolute', bottom: 12, left: 12 }}
                >
                  <PhotoFirstActionPill type="button" onClick={handleClickGallery}>
                    <SvgIcon name="chat_media_image" size={18} fill="WHITE" />
                    <Typo type="label-medium" color="WHITE">
                      {t('check_in_post.change_photo')}
                    </Typo>
                  </PhotoFirstActionPill>
                </Layout.FlexRow>
              </PhotoFirstPreviewContainer>
            ) : (
              <PhotoFirstPlaceholder>
                <SvgIcon name="camera" size={40} fill="MEDIUM_GRAY" />
                <Typo type="body-medium" color="MEDIUM_GRAY" mt={12}>
                  {t('check_in_post.add_photo_prompt')}
                </Typo>
                <Layout.FlexRow gap={12} mt={20}>
                  <PhotoFirstOptionButton type="button" onClick={handleClickGallery}>
                    <SvgIcon name="chat_media_image" size={20} fill="DARK_GRAY" />
                    <Typo type="label-large" color="DARK_GRAY">
                      {t('check_in_post.choose_photo')}
                    </Typo>
                  </PhotoFirstOptionButton>
                </Layout.FlexRow>
              </PhotoFirstPlaceholder>
            )}

            {/* Text input */}
            <NoteInput
              value={noteInfo.content}
              placeholder={placeholder || t('notes.whats_on_your_mind') || ''}
              onChange={handleChangeInput}
              minRows={3}
              maxRows={8}
              style={{ overflow: 'auto' }}
            />

            {/* Visibility toggle */}
            <Layout.FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={8}>
              {visibilityToggle}
            </Layout.FlexRow>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={onFileAdd}
              multiple={false}
              style={{ display: 'none' }}
            />

            <FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={12}>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {t('notes.content_restriction')}
              </Typo>
            </FlexRow>
          </Layout.FlexCol>
        </div>

        {isEditVisible && (
          <NewNoteImageEdit
            imageUrl={editImageUrl}
            setIsVisible={setIsEditVisible}
            onCompleteImageCrop={onCompleteImageCrop}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={12} gap={16} pb={100}>
          <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
            <ProfileImage
              imageUrl={myProfile?.profile_image}
              username={myProfile?.username}
              size={50}
            />
            <Typo type="title-medium">{myProfile?.username}</Typo>
          </Layout.FlexRow>

          {missionMode && mission && (
            <MissionPromptBlock>
              <Typo type="label-medium" color="PRIMARY" bold>
                {`${t('notes.mission_label').toUpperCase()} · ${t('notes.attempt_n_of_m', {
                  n: upcomingAttemptNumber ?? 1,
                  m: 5,
                })}`}
              </Typo>
              <Typo type="body-medium" color="DARK_GRAY" italic>
                {`"${mission.prompt}"`}
              </Typo>
            </MissionPromptBlock>
          )}

          {/* Text input */}
          <NoteInput
            value={noteInfo.content}
            placeholder={
              missionMode
                ? t('notes.mission_response_placeholder') || ''
                : placeholder || t('notes.whats_on_your_mind') || ''
            }
            onChange={handleChangeInput}
            minRows={4}
            maxRows={10}
            style={{
              marginBottom: 20,
              overflow: 'auto',
            }}
            disabled={missionMode && attemptsRemaining <= 0}
          />

          {/* Media button and visibility options */}
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" mt={20}>
            <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
            {visibilityToggle}
          </Layout.FlexRow>

          {/* 첨부한 노트 이미지 */}
          {noteInfo?.images && noteInfo.images.length > 0 && (
            <Layout.FlexCol w="100%">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {noteInfo.images[0] && noteInfo.images[0].url && (
                  <NoteImage
                    src={noteInfo.images[0].url}
                    alt="Note image"
                    style={{
                      maxWidth: 50,
                      height: 'auto',
                      display: 'block',
                      borderRadius: 8,
                    }}
                  />
                )}
                <Layout.Absolute t={-4} r={-4}>
                  <SvgIcon name="delete_image" size={32} onClick={handleDeleteImage} />
                </Layout.Absolute>
              </div>
            </Layout.FlexCol>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={onFileAdd}
            multiple={false}
            style={{ display: 'none' }}
          />

          <FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={12}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('notes.content_restriction')}
            </Typo>
          </FlexRow>
        </Layout.FlexCol>
      </div>

      {isEditVisible && (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}

      <NewNotePhotoUploadBottomSheet
        visible={showPhotoUploadBottomSheet}
        closeBottomSheet={closePhotoUploadBottomSheet}
        onClickOpenCamera={handleOpenCamera}
        onClickOpenAlbum={handleOpenAlbum}
      />
    </>
  );
}

const MissionPromptBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: #f8f4fe;
  border-left: 3px solid ${Colors.PRIMARY};
`;

const PhotoFirstPlaceholder = styled.div`
  width: 100%;
  min-height: 280px;
  border: 2px dashed ${Colors.LIGHT_GRAY};
  border-radius: 16px;
  background-color: ${Colors.INPUT_GRAY};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
`;

const PhotoFirstOptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  border: 1.5px solid ${Colors.LIGHT_GRAY};
  background-color: ${Colors.WHITE};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: ${Colors.LIGHT};
  }
`;

const PhotoFirstPreviewContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PhotoFirstPreviewImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 12px;
  background-color: ${Colors.LIGHT};
  display: block;
`;

const PhotoFirstActionPill = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export default NewNoteContent;
