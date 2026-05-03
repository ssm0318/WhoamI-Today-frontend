import { CSSProperties, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfoPopup from '@components/_common/info-popup/InfoPopup';
import { Typo } from '@design-system';
import { useUserProfileMutuals } from '@hooks/useUserProfileMutuals';
import MutualFriendsList from './MutualFriendsList';
import MutualTraitsList from './MutualTraitsList';

interface MutualMetaTextProps {
  username: string;
  mutualFriendCount: number;
  mutualInterestCount: number;
  mutualPersonaCount: number;
  hideTraits?: boolean;
  hideLeadingSeparator?: boolean;
}

function MutualMetaText({
  username,
  mutualFriendCount,
  mutualInterestCount,
  mutualPersonaCount,
  hideTraits = false,
  hideLeadingSeparator = false,
}: MutualMetaTextProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [traitsOpen, setTraitsOpen] = useState(false);

  const traitCount = hideTraits ? 0 : mutualInterestCount + mutualPersonaCount;
  const showFriends = mutualFriendCount > 0;
  const showTraits = traitCount > 0;

  const { mutuals, mutualInterests, mutualPersonas, isLoading } = useUserProfileMutuals(
    username,
    friendsOpen || traitsOpen,
  );

  if (!showFriends && !showTraits) return null;

  const openFriends = (e: MouseEvent) => {
    e.stopPropagation();
    setFriendsOpen(true);
  };

  const openTraits = (e: MouseEvent) => {
    e.stopPropagation();
    setTraitsOpen(true);
  };

  const shouldShowFriendsSeparator = showFriends && !hideLeadingSeparator;
  const shouldShowTraitsSeparator = showTraits && (!hideLeadingSeparator || showFriends);

  return (
    <>
      {showFriends && (
        <>
          {shouldShowFriendsSeparator && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              ·
            </Typo>
          )}
          <button type="button" onClick={openFriends} style={linkButtonStyle}>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
              <Typo type="label-medium" color="PRIMARY" fontWeight={500}>
                {t('mutual_friends_count', { count: mutualFriendCount })}
              </Typo>
            </span>
          </button>
        </>
      )}
      {showTraits && (
        <>
          {shouldShowTraitsSeparator && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              ·
            </Typo>
          )}
          <button type="button" onClick={openTraits} style={linkButtonStyle}>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
              <Typo type="label-medium" color="PRIMARY" fontWeight={500}>
                {t('mutual_traits_count', { count: traitCount })}
              </Typo>
            </span>
          </button>
        </>
      )}
      <InfoPopup
        isOpen={friendsOpen}
        onClose={() => setFriendsOpen(false)}
        title={t('mutual_friends_title')}
      >
        <MutualFriendsList
          users={mutuals}
          isLoading={isLoading}
          emptyText={t('empty_mutuals')}
          onItemClick={() => setFriendsOpen(false)}
        />
      </InfoPopup>
      <InfoPopup
        isOpen={traitsOpen}
        onClose={() => setTraitsOpen(false)}
        title={t('mutual_traits_title')}
      >
        <MutualTraitsList
          traits={[...mutualInterests, ...mutualPersonas]}
          isLoading={isLoading}
          emptyText={t('empty_mutual_traits')}
        />
      </InfoPopup>
    </>
  );
}

const linkButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
};

export default MutualMetaText;
