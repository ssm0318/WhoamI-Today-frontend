import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';

const SIDE_MENU_LIST = [
  { key: 'friends', path: '/settings/friends' },
  { key: 'questions', path: '/questions' },
  { key: 'settings', path: '/settings' },
];

interface Props {
  closeSideMenu: () => void;
}

// TODO: 등장/퇴장 애니메이션 추가
function SideMenu({ closeSideMenu }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'home.header.side_menu' });
  const navigate = useNavigate();

  const handleClickMenu = (path: string) => () => {
    navigate(path);
  };

  const handleClickDimmed = () => {
    closeSideMenu();
  };

  return createPortal(
    <Layout.Absolute t={0} l={0} r={0} b={0} z={Z_INDEX.MODAL_CONTAINER}>
      <Layout.Absolute w="100%" h="100%" bgColor="DIM" onClick={handleClickDimmed} />
      <Layout.Absolute r={0} w={250} h="100%" bgColor="WHITE">
        <Layout.FlexCol pt={56} pl={24}>
          <SvgIcon name="close" color="BLACK" size={24} onClick={handleClickDimmed} />
          <Layout.FlexCol gap={12} pt={30}>
            {SIDE_MENU_LIST.map((menu) => (
              <button type="button" key={menu.key} onClick={handleClickMenu(menu.path)}>
                <Font.Display type="24_bold">{t(menu.key)}</Font.Display>
              </button>
            ))}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.Absolute>
    </Layout.Absolute>,
    document.getElementById('root-container') || document.body,
  );
}

export default SideMenu;
