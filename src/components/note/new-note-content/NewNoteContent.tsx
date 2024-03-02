import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { NoteInput } from './NoteInputBox.styled';

function NewNoteContent() {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const PLACE_HOLDER = t('whats_on_your_mind');

  const [inputValue, setInputValue] = useState('');

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDownInput = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
    // sendPost();
  };

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  return (
    <Layout.FlexRow w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
      <ProfileImage imageUrl={myProfile?.profile_image} username={myProfile?.username} size={50} />
      <Layout.FlexCol w="100%" gap={8} pv={8}>
        <Font.Body type="16_semibold">{myProfile?.username}</Font.Body>
        <NoteInput
          value={inputValue}
          placeholder={PLACE_HOLDER}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDownInput}
        />
        <SvgIcon name="chat_media_image" size={30} />
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default NewNoteContent;
