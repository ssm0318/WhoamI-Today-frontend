import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, CheckCircle, Font, Layout, SvgIcon } from '@design-system';
import { friendGroupList } from '@mock/friends';
import { FriendGroup } from '@models/friendGroup';
import { Margin } from 'src/design-system/layouts';
import {
  StyledCommonListItem,
  StyledGroupItem,
  StyledList,
  StyledListSettingItem,
} from './FriendGroupList.styled';

interface CheckFriendGroup extends FriendGroup {
  checked?: boolean;
}

function FriendGroupList() {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });

  const [mode, setMode] = useState<'list' | 'edit'>('list');
  // FIXME: 실제 데이터
  const [checkedGroupList, setCheckedGroupList] = useState<CheckFriendGroup[]>(friendGroupList);

  const resetCheckGroupList = () => {
    const list = checkedGroupList.map((group) => ({ ...group, checked: false }));
    setCheckedGroupList(list);
  };

  const handleClickEdit = () => setMode('edit');
  const handleClickSave = () => {
    // TODO
    setMode('list');
    resetCheckGroupList();
  };

  const navigate = useNavigate();
  const handleGoToGroup = ({ id }: FriendGroup) => {
    navigate(`${id}`);
  };

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
    <MainContainer>
      <TitleHeader
        title={t('title')}
        RightComponent={
          mode === 'edit' ? (
            <button type="button" onClick={handleClickSave}>
              <Font.Display type="18_bold" color="PRIMARY">
                {t('save')}
              </Font.Display>
            </button>
          ) : (
            <button type="button" onClick={handleClickEdit}>
              <Font.Display type="18_bold" color="PRIMARY">
                {t('edit')}
              </Font.Display>
            </button>
          )
        }
      />
      <Layout.LayoutBase w="100%" pt={TITLE_HEADER_HEIGHT + 50} ph={24}>
        <StyledList>
          {mode === 'list' &&
            checkedGroupList.map((group) => (
              <StyledCommonListItem
                key={group.id}
                role="button"
                onClick={() => handleGoToGroup(group)}
              >
                <Group group={group} />
                <SvgIcon name="more_arrow" color="BASIC_BLACK" size={16} />
              </StyledCommonListItem>
            ))}
          {mode === 'edit' &&
            checkedGroupList.map((group) => (
              <StyledCommonListItem key={group.id}>
                <Layout.FlexRow alignItems="center">
                  <CheckCircle
                    checked={!!group.checked}
                    name={group.name}
                    onChange={() => handleToggleFriendGroup(group)}
                    hideLabel
                  />
                  <Group group={group} ml={20} />
                </Layout.FlexRow>
                <SvgIcon name="order_group" color="GRAY_6" size={16} />
              </StyledCommonListItem>
            ))}
          <StyledListSettingItem>
            <Layout.FlexRow>
              <SvgIcon name="check_circle_add" size={20} />
              <Font.Display type="14_semibold" color="PRIMARY" ml={12}>
                {t('add_group')}
              </Font.Display>
            </Layout.FlexRow>
          </StyledListSettingItem>
        </StyledList>
        {showDeleteGroupButton && (
          <Button.Dialog
            status="normal"
            type="warning_fill"
            text={t('delete_group')}
            sizing="stretch"
          />
        )}
      </Layout.LayoutBase>
    </MainContainer>
  );
}

function Group({ group, ...props }: { group: FriendGroup } & Margin) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });
  const { name, member_cnt } = group;

  return (
    <StyledGroupItem {...props}>
      <Font.Display type="14_regular">{name}</Font.Display>
      <Font.Body type="10_regular" color="GRAY_3">
        {t('member_count', { count: member_cnt })}
      </Font.Body>
    </StyledGroupItem>
  );
}

export default FriendGroupList;
