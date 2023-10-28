import { useTranslation } from 'react-i18next';
import TitleHeader from '@components/title-header/TitleHeader';
import { Font } from '@design-system';

interface FriendGroupListProps {
  onClose: () => void;
}
function FriendGroupList({ onClose }: FriendGroupListProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });
  return (
    <TitleHeader
      title={t('title')}
      RightComponent={
        <button type="button">
          <Font.Display type="18_bold" color="PRIMARY">
            {t('save')}
          </Font.Display>
        </button>
      }
      onClose={onClose}
    />
  );
}

export default FriendGroupList;
