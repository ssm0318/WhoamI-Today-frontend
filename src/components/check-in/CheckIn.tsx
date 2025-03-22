import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { MyProfile } from '@models/api/user';
import { CheckInBase } from '@models/checkIn';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import SocialBatteryChip from '../profile/social-batter-chip/SocialBatteryChip';

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
  const { social_battery, track_id, mood, description, current_user_read } = checkIn || {};
  const hasCheckIn = checkIn && (mood || description || social_battery || track_id);

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
      <>
        {/* check in time */}
        {checkIn?.created_at && (
          <Layout.FlexRow w="100%" justifyContent="flex-start" gap={4}>
            <Typo type="label-medium" numberOfLines={2} color="MEDIUM_GRAY">
              {t('checked_in_time', {
                time: convertTimeDiffByString({
                  now: currentDate,
                  day: new Date(checkIn?.created_at),
                }),
              })}
            </Typo>
            {!current_user_read && !isMyPage && <UpdatedLabel />}
          </Layout.FlexRow>
        )}
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
          <Layout.FlexRow gap={8} alignItems="center">
            {/* social battery */}
            {social_battery && <SocialBatteryChip socialBattery={social_battery} />}
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
          {(!!social_battery || !!track_id) && isMyPage && (
            <SvgIcon
              name="edit_filled"
              fill="DARK_GRAY"
              size={24}
              onClick={handleClickEditCheckIn}
            />
          )}
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" alignItems="center" gap={8}>
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
          {!social_battery && !track_id && isMyPage && (
            <SvgIcon
              name="edit_filled"
              fill="DARK_GRAY"
              size={24}
              onClick={handleClickEditCheckIn}
            />
          )}
        </Layout.FlexRow>
      </>
    </Layout.FlexCol>
  );
}

export default CheckIn;
