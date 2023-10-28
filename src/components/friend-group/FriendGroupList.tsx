import { useTranslation } from 'react-i18next';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { friendGroupList } from '@mock/friends';
import { FriendGroup } from '@models/friendGroup';
import { StyledCheckBox, StyledGroup, StyledGroupList } from './FriendGroupList.styled';

function CheckBox({ name }: FriendGroup) {
  return (
    <StyledCheckBox>
      <input id={name} type="checkbox" />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={name} />
      <label className="display-label" htmlFor={name}>
        {name}
      </label>
    </StyledCheckBox>
  );
}
interface FriendGroupListProps {
  onClose: () => void;
}
function FriendGroupList({ onClose }: FriendGroupListProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });

  return (
    <Layout.Absolute t={0} l={0} w="100%" h="100%" bgColor="BASIC_WHITE">
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
      <Layout.LayoutBase w="100%" mt={TITLE_HEADER_HEIGHT + 50} mh={24}>
        <StyledGroupList>
          {friendGroupList.map((group) => (
            <StyledGroup key={group.id}>
              <CheckBox {...group} />
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
      </Layout.LayoutBase>
    </Layout.Absolute>
  );
}

export default FriendGroupList;
