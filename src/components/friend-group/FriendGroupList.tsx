import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, CheckCircle, Font, Layout, SvgIcon } from '@design-system';
import { friendGroupList } from '@mock/friends';
import { FriendGroup } from '@models/friendGroup';
import { StyledGroup, StyledGroupList } from './FriendGroupList.styled';

interface FriendGroupListProps {
  onClose: () => void;
}

interface CheckFriendGroup extends FriendGroup {
  checked?: boolean;
}

function FriendGroupList({ onClose }: FriendGroupListProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });
  const [checkedGroupList, setCheckedGroupList] = useState<CheckFriendGroup[]>(friendGroupList);

  const handleToggleFriendGroup = (item: CheckFriendGroup) => {
    const selectedGroupIndex = checkedGroupList.findIndex((group) => group.id === item.id);

    if (selectedGroupIndex === -1) return;

    setCheckedGroupList((list) => [
      ...list.slice(0, selectedGroupIndex),
      { ...list[selectedGroupIndex], checked: !list[selectedGroupIndex].checked },
      ...list.slice(selectedGroupIndex + 1),
    ]);
  };

  const showDeleteGroupButton = !!checkedGroupList.find((group) => !!group.checked);

  return (
    <Layout.Absolute t={0} l={0} w="100%" h="100%" bgColor="BASIC_WHITE" flexDirection="column">
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
      <Layout.LayoutBase w="100%" pt={TITLE_HEADER_HEIGHT + 50} ph={24}>
        <StyledGroupList>
          {checkedGroupList.map((group) => (
            <StyledGroup key={group.id}>
              <CheckCircle
                checked={!!group.checked}
                name={group.name}
                onChange={() => handleToggleFriendGroup(group)}
              />
              <SvgIcon name="order_group" color="GRAY_6" size={16} />
            </StyledGroup>
          ))}
          <StyledGroup>
            <Layout.FlexRow>
              <SvgIcon name="check_circle_add" size={20} />
              <Font.Display type="14_semibold" color="PRIMARY" ml={12}>
                {t('add_group')}
              </Font.Display>
            </Layout.FlexRow>
          </StyledGroup>
        </StyledGroupList>
        {showDeleteGroupButton && (
          <Button.Dialog
            status="normal"
            type="warning_fill"
            text={t('delete_group')}
            sizing="stretch"
          />
        )}
      </Layout.LayoutBase>
    </Layout.Absolute>
  );
}

export default FriendGroupList;
