import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '@constants/layout';
import { Font, Layout } from '@design-system';

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

  return (
    <Layout.Fixed t={0} l={0} r={0} b={0} z={Z_INDEX.MODAL_CONTAINER}>
      <Layout.Absolute w="100%" h="100%" bgColor="DIM" onClick={handleClickDimmed} />
      <Layout.Absolute w={250} h="100%" bgColor="BASIC_WHITE">
        <Layout.FlexCol gap={15} pt={30} pl={25}>
          {SIDE_MENU_LIST.map((menu) => (
            <button type="button" key={menu.key} onClick={handleClickMenu(menu.path)}>
              <Font.Display type="18_bold">{t(menu.key)}</Font.Display>
            </button>
          ))}
        </Layout.FlexCol>
      </Layout.Absolute>
    </Layout.Fixed>
  );
}

export default SideMenu;
