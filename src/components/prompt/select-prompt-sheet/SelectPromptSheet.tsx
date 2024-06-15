import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';
import PromptsOfTheDay from '../prompts-of-the-day/PromptOfTheDay';

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
}

function SelectPromptSheet({ visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'prompts' });

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">{t('select_a_prompt')}</Typo>
        <Divider width={1} margin={16} />
        <Layout.FlexCol gap={16} w="100%">
          <PromptsOfTheDay />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default SelectPromptSheet;
