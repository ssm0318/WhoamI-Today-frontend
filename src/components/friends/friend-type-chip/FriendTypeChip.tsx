import { useTranslation } from 'react-i18next';
import { SvgIcon, Typo } from '@design-system';
import { ChipContainer, StarIconContainer } from './FriendTypeChip.styled';

export type FriendType = 'all' | 'close';

interface FriendTypeChipProps {
  type: FriendType;
  isSelected: boolean;
  count?: number;
  onClick: () => void;
}

function FriendTypeChip({ type, isSelected, count, onClick }: FriendTypeChipProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list' });

  const isAllFriends = type === 'all';

  return (
    <ChipContainer isSelected={isSelected} onClick={onClick}>
      {!isAllFriends && (
        <StarIconContainer isSelected={isSelected}>
          <SvgIcon name="star" size={12} color="WHITE" />
        </StarIconContainer>
      )}
      <Typo type="label-large" color={isSelected ? 'WHITE' : 'BLACK'}>
        {isAllFriends
          ? `${t('all_friends')}${count !== undefined ? ` (${count})` : ''}`
          : t('close_friend')}
      </Typo>
    </ChipContainer>
  );
}

export default FriendTypeChip;
