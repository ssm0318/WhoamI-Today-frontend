import { useState } from 'react';
import UserProfile from '@components/_common/user-profile/UserProfile';
import { Font, Layout, SvgIcon } from '@design-system';
import { User } from '@models/user';

interface SendQuestionFriendItemProps {
  onToggle: (selected: boolean) => void;
  user: User;
}

function SendQuestionFriendItem({ onToggle, user }: SendQuestionFriendItemProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleToggle = () => {
    setIsSelected((prevSelected) => !prevSelected);
    onToggle(!isSelected);
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
        <UserProfile imageUrl={user.profile_image} username={user.username} size={55} />
        <Font.Body type="14_semibold">{user.username}</Font.Body>
      </Layout.FlexRow>
      <SvgIcon name={isSelected ? 'circle_check_checked' : 'circle_check_unchecked'} size={24} />
    </Layout.FlexRow>
  );
}

export default SendQuestionFriendItem;
