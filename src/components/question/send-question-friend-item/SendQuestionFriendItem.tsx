import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout, SvgIcon } from '@design-system';
import { User } from '@models/user';

interface SendQuestionFriendItemProps {
  user: User;
  isSelected: boolean;
  setIsSelected: (selected: boolean) => void;
}

function SendQuestionFriendItem({ user, isSelected, setIsSelected }: SendQuestionFriendItemProps) {
  const handleToggle = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Layout.FlexRow
      onClick={handleToggle}
      justifyContent="space-between"
      w="100%"
      alignItems="center"
      ph={4}
    >
      <Layout.FlexRow gap={7} alignItems="center">
        <ProfileImage imageUrl={user.profile_image} username={user.username} size={55} />
        <Font.Body type="14_semibold">{user.username}</Font.Body>
      </Layout.FlexRow>
      <SvgIcon name={isSelected ? 'circle_check_checked' : 'circle_check_unchecked'} size={24} />
    </Layout.FlexRow>
  );
}

export default SendQuestionFriendItem;
