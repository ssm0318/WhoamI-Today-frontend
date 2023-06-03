import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';

interface SendQuestionFriendItemProps {
  onToggle: (selected: boolean) => void;
  user: { id: number; name: string; profile_pic: string };
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
        <SvgIcon name="my_profile" size={55} />
        <Font.Body type="14_semibold">{user.name}</Font.Body>
      </Layout.FlexRow>
      <SvgIcon name={isSelected ? 'circle_check_checked' : 'circle_check_unchecked'} size={24} />
    </Layout.FlexRow>
  );
}

export default SendQuestionFriendItem;
