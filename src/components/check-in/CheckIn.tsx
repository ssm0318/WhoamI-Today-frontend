import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { MyProfile } from '@models/api/user';
import { CheckInBase } from '@models/checkIn';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import AvailabilityChip from '../profile/availability-chip/AvailabilityChip';
import AddNewCheckIn from './add-new-check-in/AddNewCheckIn';

interface CheckInProps {
  user: UserProfile | MyProfile;
}

function CheckIn({ user }: CheckInProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page.check_in' });
  const {
    myProfile,
    checkIn: initialCheckIn,
    fetchCheckIn,
  } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
  }));
  const isMyPage = user?.id === myProfile?.id;
  const [checkIn, setCheckIn] = useState<CheckInBase | null | undefined>(
    isMyPage ? initialCheckIn : user.check_in,
  );
  const { availability, track_id, mood, description } = checkIn || {};
  const hasCheckIn = checkIn && (mood || description || availability || track_id);

  const [currentDate] = useState(() => new Date());
  const navigate = useNavigate();

  const handleClickEditCheckIn = () => {
    return navigate('/check-in/edit');
  };

  useAsyncEffect(async () => {
    if (!isMyPage) return;
    const myCheckIn = await fetchCheckIn();
    setCheckIn(myCheckIn);
  }, [isMyPage]);

  // TODO: 체크인 로딩 표시
  if (!hasCheckIn && !isMyPage) return null;
  return (
    <Layout.FlexCol w="100%" gap={8} p={16} bgColor="GRAY_14" rounded={8} justifyContent="center">
      {hasCheckIn ? (
        <>
          <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
            <Layout.FlexRow gap={8} alignItems="center">
              {/* availability */}
              {availability && <AvailabilityChip availability={availability} />}
              {/* spotify */}
              {track_id && (
                <SpotifyMusic
                  track={track_id}
                  useDetailBottomSheet
                  useAlbumImg
                  fontType="label-large"
                />
              )}
            </Layout.FlexRow>
            {/* more */}
            {isMyPage && (
              <SvgIcon
                name="edit_filled"
                fill="DARK_GRAY"
                size={24}
                onClick={handleClickEditCheckIn}
              />
            )}
          </Layout.FlexRow>
          {(!!mood || !!description) && (
            <Layout.FlexRow
              w="100%"
              gap={8}
              bgColor="WHITE"
              alignItems="center"
              outline="GRAY_1"
              ph={8}
              pv={4}
              rounded={12}
            >
              {/* emoji */}
              {mood && (
                <EmojiItem
                  emojiString={mood}
                  size={24}
                  bgColor="TRANSPARENT"
                  outline="TRANSPARENT"
                />
              )}
              {/* description */}
              {description && (
                <Typo type="label-large" numberOfLines={2}>
                  {description}
                </Typo>
              )}
            </Layout.FlexRow>
          )}

          {/* check in time */}
          <Layout.FlexRow w="100%" justifyContent="flex-end">
            <Typo type="label-medium" numberOfLines={2} color="MEDIUM_GRAY">
              {t('checked_in_time', {
                time: convertTimeDiffByString({
                  now: currentDate,
                  day: new Date(checkIn?.created_at),
                }),
              })}
            </Typo>
          </Layout.FlexRow>
        </>
      ) : (
        <AddNewCheckIn />
      )}
    </Layout.FlexCol>
  );
}

export default CheckIn;
