import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ChipContainer } from './FriendTypeChip.styled';

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
      <Layout.FlexRow alignItems="center" gap={4} h={24}>
        {!isAllFriends && (
          <Layout.FlexRow h={24}>
            <SvgIcon name="close_friend" size={24} />
          </Layout.FlexRow>
        )}
        <Typo type="button-medium" color={isSelected ? 'WHITE' : 'BLACK'}>
          {isAllFriends
            ? `${t('all_friends')}${count !== undefined ? ` (${count})` : ''}`
            : `${t('close_friend')}${count !== undefined ? ` (${count})` : ''}`}
        </Typo>
      </Layout.FlexRow>
    </ChipContainer>
  );
}

export default FriendTypeChip;
