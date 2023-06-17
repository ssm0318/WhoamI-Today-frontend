import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Font, Layout } from '@design-system';
import useRedirectGuard from '@hooks/useRedirectGuard';
import { TodayMoment } from '@models/moment';
import { postTodayMoment } from '@utils/apis/moment';
import DescriptionStep from './description-step/DescriptionStep';
import MoodStep from './mood-step/MoodStep';

function MomentUploadSteps() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<keyof Omit<TodayMoment, 'photo'>>(
    location.state || 'mood',
  );
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');

  const handlePost = async () => {
    if (currentStep === 'mood') {
      await postTodayMoment({
        mood,
      });
      setCurrentStep('description');
    } else {
      await postTodayMoment({
        description,
      });
      navigate('/home');
    }
  };

  const handleSkipMood = () => {
    setCurrentStep('description');
  };

  const handleSkipDescription = () => {
    navigate('/home');
  };

  useRedirectGuard();

  if (!location.state) return null;
  return (
    <Layout.FlexCol
      alignItems="center"
      pt={20}
      h="100%"
      w="100%"
      style={{
        position: 'relative',
      }}
      justifyContent="space-between"
    >
      <Layout.FlexRow>
        <Font.Display type="24_bold" color="BASIC_WHITE" textAlign="center" pre>
          {currentStep === 'mood' ? t('mood_title') : t('description_title')}
        </Font.Display>
      </Layout.FlexRow>
      {currentStep === 'mood' ? (
        <MoodStep onSkip={handleSkipMood} setMood={setMood} />
      ) : (
        <DescriptionStep onSkip={handleSkipDescription} setDescription={setDescription} />
      )}
      {/* 보내기 */}
      <Layout.FlexRow w="100%" justifyContent="flex-end" pr={22} pb={20} style={{ zIndex: 2 }}>
        <Button.Medium type="white_fill" status="normal" text={t('post')} onClick={handlePost} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default MomentUploadSteps;
