import { useTranslation } from 'react-i18next';
import { Button, Font, Layout } from '@design-system';
import MomentUploadTextInput from '../../moment-upload-text-input/MomentUploadTextInput';

interface MoodStepProps {
  onSkip: () => void;
  setMood: (mood: string) => void;
}

// 이모지 업로드 화면
function MoodStep({ onSkip, setMood }: MoodStepProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  return (
    <Layout.Absolute w="100%" t={0} b={0} alignItems="center">
      <Layout.FlexCol w="100%">
        <Layout.FlexRow
          w="100%"
          justifyContent="center"
          style={{
            position: 'relative',
          }}
          mb={17}
        >
          <Font.Display type="18_bold" color="BASIC_WHITE">
            {t('mood_subtitle')}
          </Font.Display>
          <Layout.Absolute r={22}>
            <Button.Small type="white_fill" status="normal" text={t('skip')} onClick={onSkip} />
          </Layout.Absolute>
        </Layout.FlexRow>
        <MomentUploadTextInput
          setInput={setMood}
          placeholder={t('mood_placeholder') || undefined}
        />
      </Layout.FlexCol>
    </Layout.Absolute>
  );
}

export default MoodStep;
