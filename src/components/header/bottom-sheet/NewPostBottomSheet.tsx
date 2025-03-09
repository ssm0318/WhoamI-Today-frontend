import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import { Font, Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { IconNames } from 'src/design-system/SvgIcon/SvgIcon.types';
import { NewPostButton } from './NewPostBottomSheet.styled';

interface MenuItem {
  key: string;
  path: string;
  icon: IconNames;
}

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
  setSelectPrompt: (select: boolean) => void;
}

function NewPostBottomSheet({ visible, closeBottomSheet, setSelectPrompt }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'home.header.bottom_sheet' });
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const BOTTOM_SHEET_LIST: MenuItem[] = [
    { key: 'check-in', path: '/check-in/edit', icon: 'bottomsheet_checkin' as const },
    { key: 'note', path: '/notes/new', icon: 'bottomsheet_note' as const },
    ...(featureFlags?.friendList
      ? [{ key: 'prompts', path: '/check-in/prompt', icon: 'bottomsheet_prompt' as const }]
      : []),
  ];

  const handleClickMenu = (path: string) => () => {
    closeBottomSheet();
    if (path === '/check-in/prompt') {
      setSelectPrompt(true);
    } else {
      navigate(path);
    }
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" pb={34} w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">{t('title')}</Typo>
        <Layout.FlexCol gap={12} pt={24} pb={24} w="100%">
          {BOTTOM_SHEET_LIST.map((menu) => (
            <React.Fragment key={menu.key}>
              <Divider width={1} />
              <NewPostButton type="button" onClick={handleClickMenu(menu.path)}>
                <Layout.FlexRow alignItems="center" gap={15}>
                  <SvgIcon name={menu.icon} size={34} />
                  <Font.Body type="18_regular">{t(menu.key)}</Font.Body>
                </Layout.FlexRow>
              </NewPostButton>
            </React.Fragment>
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default NewPostBottomSheet;
