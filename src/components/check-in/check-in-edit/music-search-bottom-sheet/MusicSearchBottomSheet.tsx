import { Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import SearchInput from '@components/_common/search-input/SearchInput';
import { Layout, Typo } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import MusicItem from './music-item/MusicItem';
import * as S from './MusicSearchBottomSheet.styled';

type MusicSearchBottomSheetProps = {
  visible: boolean;
  closeBottomSheet: () => void;
  onSelect: (trackId: string) => void;
};

function MusicSearchBottomSheet({
  visible,
  closeBottomSheet,
  onSelect,
}: MusicSearchBottomSheetProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'check_in_edit.song.search_bottom_sheet',
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { isAndroid } = getMobileDeviceInfo();

  const spotifyManager = SpotifyManager.getInstance();

  const [query, setQuery] = useState('');

  const [trackList, setTrackList] = useState<Track[]>([]);

  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      closeBottomSheet();
    }
  };

  useAsyncEffect(async () => {
    if (!query) {
      setTrackList([]);
      return;
    }
    const tracks = await spotifyManager.searchMusic(query, 20, 0);
    setTrackList(tracks);
  }, [query]);

  const handleSelectMusic = (track: Track) => {
    setSelected((prevSelected) => (prevSelected === track.id ? null : track.id));
  };

  const [autoFocus, setAutoFocus] = useState(false);
  const autoFocusInput = () => {
    setAutoFocus(true);
  };

  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      const newKeyboardVisible = data.height > 0;
      setIsKeyboardVisible(newKeyboardVisible);
    },
  });

  if (!trackList) return null;
  return (
    <BottomModal
      visible={visible}
      onClose={closeBottomSheet}
      heightMode="full"
      onTransitionEnd={autoFocusInput}
    >
      <Layout.FlexCol alignItems="center" justifyContent="space-between" w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">{t('title')}</Typo>
        <Layout.FlexCol ph={16} mt={12} w="100%">
          {/* Search Input */}
          <Layout.FlexRow w="100%">
            <SearchInput
              query={query}
              setQuery={setQuery}
              autoFocus={autoFocus}
              fontSize={16}
              placeholder={t('search_placeholder') || undefined}
              cancelText={t('cancel') || undefined}
            />
          </Layout.FlexRow>
          {/* Song Results */}
          <Layout.FlexCol mt={12} gap={12} mb={CONFIRM_BUTTON_CONTAINER_HEIGHT + 12} w="100%">
            {!!trackList.length && (
              <Typo type="title-medium" color="MEDIUM_GRAY">
                {t('all_results')}
              </Typo>
            )}
            {trackList.map((track) => (
              <Layout.FlexRow key={track.id} w="100%">
                <MusicItem
                  track={track}
                  onSelect={handleSelectMusic}
                  selected={selected === track.id}
                />
              </Layout.FlexRow>
            ))}
          </Layout.FlexCol>
        </Layout.FlexCol>

        {(isAndroid && !isKeyboardVisible) || !isAndroid ? (
          <Layout.Fixed b={0} w="100%" bgColor="WHITE">
            <S.ConfirmButtonContainer
              w="100%"
              pt={16}
              pb={20}
              ph={12}
              h={CONFIRM_BUTTON_CONTAINER_HEIGHT}
            >
              <BottomModalActionButton
                status={selected ? 'normal' : 'disabled'}
                text={t('confirm')}
                onClick={handleConfirm}
              />
            </S.ConfirmButtonContainer>
          </Layout.Fixed>
        ) : null}
      </Layout.FlexCol>
    </BottomModal>
  );
}

const CONFIRM_BUTTON_CONTAINER_HEIGHT = 80;

export default MusicSearchBottomSheet;
