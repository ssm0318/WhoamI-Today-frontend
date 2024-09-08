import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import { Layout, Typo } from '@design-system';
import PromptsOfTheDay from '../prompts-of-the-day/PromptOfTheDay';

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
}

function SelectPromptSheet({ visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'prompts' });

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Typo type="title-large">{t('select_a_prompt')}</Typo>
        <Divider width={1} margin={16} />
        <Layout.FlexCol gap={16} w="100%">
          <PromptsOfTheDay />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default SelectPromptSheet;
