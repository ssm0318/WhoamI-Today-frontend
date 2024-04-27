import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectPromptSheet from '@components/prompt/select-prompt-sheet/SelectPromptSheet';
import Icon from '../../_common/icon/Icon';
import NewPostBottomSheet from '../bottom-sheet/NewPostBottomSheet';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

function MyHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'header' });

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [selectPrompt, setSelectPrompt] = useState(false);

  const handleNewPost = () => {
    setBottomSheet(true);
  };

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
      <MainHeader
        title={t('my')}
        rightButtons={
          <>
            <Icon name="add_post" size={44} onClick={handleNewPost} />
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {bottomSheet && (
        <NewPostBottomSheet
          visible={bottomSheet}
          closeBottomSheet={() => setBottomSheet(false)}
          setSelectPrompt={setSelectPrompt}
        />
      )}
      {selectPrompt && (
        <SelectPromptSheet visible={selectPrompt} closeBottomSheet={() => setSelectPrompt(false)} />
      )}
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default MyHeader;
