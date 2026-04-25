import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CheckInArchiveChip from '@components/check-in/archive/CheckInArchiveChip';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import MoodPlaceholder from '@components/profile/placeholders/MoodPlaceholder';
import MusicPlaceholder from '@components/profile/placeholders/MusicPlaceholder';
import SocialBatteryPlaceholder from '@components/profile/placeholders/SocialBatteryPlaceholder';
import ThoughtPlaceholder from '@components/profile/placeholders/ThoughtPlaceholder';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useFriendPinnedCount } from '@hooks/useFriendPinnedCount';
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
  const friendUsername = !isMyPage && 'username' in user ? (user as UserProfile).username : null;
  const { pinnedCount: friendPinnedCount } = useFriendPinnedCount(friendUsername);
  const [checkIn, setCheckIn] = useState<CheckInBase | null | undefined>(
    isMyPage ? initialCheckIn : user.check_in,
  );
  // Per-component visibility is enforced on the API; render payload as returned.
  const { social_battery, track_id, mood, thought } = checkIn || {};
  // Backend redacts mood to `[]` (truthy) when viewer lacks visibility — normalize to length-checked list.
  const moodList = (Array.isArray(mood) ? mood : mood ? [mood] : []).filter(Boolean);
  const hasMood = moodList.length > 0;
  const hasThought = !!thought;
  const hasCheckIn = checkIn && !!(hasMood || hasThought || social_battery || track_id);

  const [currentDate] = useState(() => new Date());
  const navigate = useNavigate();

  const handleClickEditCheckIn = () => {
    return navigate('/update');
  };

  useAsyncEffect(async () => {
    if (!isMyPage) return;
    const myCheckIn = await fetchCheckIn();
    setCheckIn(myCheckIn);
  }, [isMyPage]);

  // TODO: 체크인 로딩 표시
  if (!hasCheckIn && !isMyPage) return null;
  return (
    <Layout.FlexCol w="100%" gap={8} p={8} bgColor="GRAY_14" rounded={8} justifyContent="center">
      <>
        {/* Top row: title (left) + archive/pinned entry point (right).
            Own profile → [All | Pinned (N)] segmented.
            Friend profile → Pinned Check-ins (N) link (hidden when count=0).
            flex-wrap + row-gap ensures the chips fall to the next line on
            narrow phones (iPhone SE 1st gen = 320px) rather than overlap
            or clip the title. */}
        <Layout.FlexRow
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          style={{ flexWrap: 'wrap', rowGap: 4, columnGap: 8 }}
        >
          <Typo type="label-large" color="BLACK">
            {t('title')}
          </Typo>
          {isMyPage ? (
            <CheckInArchiveChip />
          ) : (
            friendUsername && (
              <FriendPinnedChip
                pinnedCount={friendPinnedCount}
                to={`/users/${friendUsername}/check-in/pinned`}
              />
            )
          )}
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
          <Layout.FlexRow gap={8} alignItems="center">
            {/* social battery */}
            {social_battery ? (
              <SocialBatteryChip
                socialBattery={social_battery}
                onClick={() => {
                  if (!isMyPage) return;
                  handleClickEditCheckIn();
                }}
              />
            ) : (
              isMyPage && <SocialBatteryPlaceholder />
            )}
            {/* spotify */}
            {track_id ? (
              <SpotifyMusic
                track={track_id}
                useDetailBottomSheet={!isMyPage}
                useAlbumImg
                fontType="label-large"
                onClick={() => {
                  if (!isMyPage) return;
                  handleClickEditCheckIn();
                }}
              />
            ) : (
              isMyPage && <MusicPlaceholder />
            )}
          </Layout.FlexRow>
        </Layout.FlexRow>
        {(isMyPage || hasMood || hasThought) && (
          <Layout.FlexRow w="100%" alignItems="center" gap={8} style={{ flexWrap: 'wrap' }}>
            {(isMyPage || hasMood) &&
              (hasMood ? (
                <Layout.FlexRow
                  gap={4}
                  bgColor="WHITE"
                  alignItems="center"
                  outline="LIGHT_GRAY"
                  ph={8}
                  pv={4}
                  rounded={8}
                  style={{ flexShrink: 0 }}
                  onClick={() => {
                    if (!isMyPage) return;
                    handleClickEditCheckIn();
                  }}
                >
                  {moodList.map((emoji) => (
                    <span key={emoji} style={{ fontSize: 16, lineHeight: 1 }}>
                      {emoji}
                    </span>
                  ))}
                </Layout.FlexRow>
              ) : (
                isMyPage && (
                  <div style={{ flexShrink: 0 }}>
                    <MoodPlaceholder />
                  </div>
                )
              ))}
            {(isMyPage || hasThought) &&
              (hasThought ? (
                <Layout.FlexRow
                  gap={4}
                  bgColor="WHITE"
                  alignItems="center"
                  outline="LIGHT_GRAY"
                  ph={8}
                  pv={4}
                  rounded={8}
                  style={{ minWidth: 0, maxWidth: '100%' }}
                  onClick={() => {
                    if (!isMyPage) return;
                    handleClickEditCheckIn();
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
                    💭
                  </span>
                  <Typo type="label-large" numberOfLines={2}>
                    {thought}
                  </Typo>
                </Layout.FlexRow>
              ) : (
                isMyPage && (
                  <div style={{ flexShrink: 0 }}>
                    <ThoughtPlaceholder />
                  </div>
                )
              ))}
          </Layout.FlexRow>
        )}
        {/* Bottom row: timestamp (left) + edit pencil (right, own-profile only). */}
        {(isMyPage || checkIn?.created_at) && (
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" gap={4}>
            {checkIn?.created_at ? (
              <Layout.FlexRow alignItems="center" gap={4}>
                <Typo type="label-medium" numberOfLines={2} color="MEDIUM_GRAY">
                  {t('checked_in_time', {
                    time: convertTimeDiffByString({
                      now: currentDate,
                      day: new Date(checkIn?.created_at),
                    }),
                  })}
                </Typo>
              </Layout.FlexRow>
            ) : (
              <span />
            )}
            {isMyPage && (
              <SvgIcon
                name="edit_filled"
                fill="DARK_GRAY"
                size={20}
                onClick={handleClickEditCheckIn}
              />
            )}
          </Layout.FlexRow>
        )}
      </>
    </Layout.FlexCol>
  );
}

export default CheckIn;
