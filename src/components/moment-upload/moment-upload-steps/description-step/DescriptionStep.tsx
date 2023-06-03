import { useTranslation } from 'react-i18next';
import { Button, Layout } from '@design-system';
import MomentUploadTextInput from '../../moment-upload-text-input/MomentUploadTextInput';

interface DescriptionStepProps {
  onSkip: () => void;
  setDescription: (description: string) => void;
}

// 디스크립션 업로드 화면
function DescriptionStep({ onSkip, setDescription }: DescriptionStepProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  return (
    <Layout.Absolute w="100%" t={0} b={0} alignItems="center">
      <Layout.FlexCol w="100%">
        <Layout.FlexRow
          w="100%"
          justifyContent="flex-end"
          style={{
            position: 'relative',
          }}
          mb={17}
          pr={22}
        >
          <Button.Small type="white_fill" status="normal" text={t('skip')} onClick={onSkip} />
        </Layout.FlexRow>
        <MomentUploadTextInput
          setInput={setDescription}
          placeholder={t('description_placeholder') || undefined}
          maxLength={20}
        />
      </Layout.FlexCol>
    </Layout.Absolute>
  );
}

export default DescriptionStep;
