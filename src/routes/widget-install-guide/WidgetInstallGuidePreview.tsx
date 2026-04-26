import { useTranslation } from 'react-i18next';
import { PhoneIllustration } from './WidgetInstallGuide';
import * as S from './WidgetInstallGuide.styled';

const TOTAL_STEPS = 4;
const PLATFORMS = ['ios', 'android'] as const;

type Platform = (typeof PLATFORMS)[number];

function PreviewCard({ platform, step }: { platform: Platform; step: number }) {
  const [t] = useTranslation('translation', { keyPrefix: 'widget_install_guide' });
  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div style={{ flex: '0 0 auto', width: 320 }}>
      <S.Container style={{ position: 'static', minHeight: 'unset', padding: '40px 20px 24px' }}>
        <S.Title>{t('title')}</S.Title>
        <S.IllustrationWrapper>
          <PhoneIllustration step={step} platform={platform} />
        </S.IllustrationWrapper>
        <S.StepText>{t(`${platform}.step${step + 1}`)}</S.StepText>
        <S.Dots>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map((i) => (
            <S.Dot key={`dot-${i}`} $active={i === step} />
          ))}
        </S.Dots>
        <S.CtaButton $active={isLast}>{t('cta')}</S.CtaButton>
      </S.Container>
    </div>
  );
}

function WidgetInstallGuidePreview() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ padding: 16, fontSize: 12, opacity: 0.6 }}>
        Preview only — auth bypassed at /test/widget-install-guide
      </div>
      {PLATFORMS.map((platform) => (
        <div key={platform}>
          <h2 style={{ padding: '8px 16px', margin: 0 }}>{platform.toUpperCase()}</h2>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 16, padding: 16 }}>
            {Array.from({ length: TOTAL_STEPS }, (_, step) => step).map((step) => (
              <PreviewCard key={`${platform}-${step}`} platform={platform} step={step} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WidgetInstallGuidePreview;
