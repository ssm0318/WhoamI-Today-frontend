import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import { Font, Layout, Typo } from '@design-system';
import { IconNames } from 'src/design-system/SvgIcon/SvgIcon.types';

interface MenuItem {
  key: string;
  path: string;
  icon: IconNames;
}

const BOTTOM_SHEET_LIST: MenuItem[] = [
  { key: 'check-in', path: '/check-in/edit', icon: 'bottomsheet_checkin' },
  { key: 'note', path: '/notes/new', icon: 'bottomsheet_note' },
  { key: 'prompts', path: '/check-in/edit', icon: 'bottomsheet_prompt' },
];

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
}

function NewPostBottomSheet({ visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'home.header.bottom_sheet' });
  const navigate = useNavigate();

  const handleClickMenu = (path: string) => () => {
    navigate(path);
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet} maxHeight={700}>
      <Layout.FlexCol alignItems="center" pb={34} w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">Create</Typo>
        <Layout.FlexCol gap={12} pt={24} pb={24} w="100%">
          {BOTTOM_SHEET_LIST.map((menu) => (
            <React.Fragment key={menu.key}>
              <Divider width={1} />
              <button
                type="button"
                onClick={handleClickMenu(menu.path)}
                style={{ padding: '0 25px' }}
              >
                <Layout.FlexRow alignItems="center" gap={15}>
                  <Icon name={menu.icon} size={34} />
                  <Font.Body type="18_regular">{t(menu.key)}</Font.Body>
                </Layout.FlexRow>
              </button>
            </React.Fragment>
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default NewPostBottomSheet;
