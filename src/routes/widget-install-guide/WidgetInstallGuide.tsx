import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '@stores/useBoundStore';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { markWidgetGuideSeen } from '@utils/widgetInstallGuide';
import * as S from './WidgetInstallGuide.styled';

const TOTAL_STEPS = 4;

type Platform = 'ios' | 'android';

const APP_DOT_IDS = Array.from({ length: 18 }, (_, i) => `app-${i}`);
const STEP_INDICES = Array.from({ length: TOTAL_STEPS }, (_, i) => i);

function IosIllustration({ step }: { step: number }) {
  if (step === 3) {
    return (
      <S.PhoneFrame>
        <S.SearchBar>🔍 WhoAmI Today</S.SearchBar>
        <S.WidgetResult>
          <S.WidgetIcon src="/whoami192.png" alt="" />
          <S.WidgetLabel>WhoAmI Today</S.WidgetLabel>
        </S.WidgetResult>
        <S.WidgetPreviewGrid>
          <S.WidgetPreviewBox />
          <S.WidgetPreviewBox />
          <S.WidgetPreviewBox />
          <S.WidgetPreviewBox />
        </S.WidgetPreviewGrid>
        <S.HomeIndicator />
      </S.PhoneFrame>
    );
  }

  return (
    <S.PhoneFrame>
      {step === 1 && <S.EditBadge>Edit</S.EditBadge>}
      <S.AppGrid>
        {APP_DOT_IDS.map((id) => (
          <S.AppDot key={id} />
        ))}
      </S.AppGrid>
      {step === 2 && <S.OverlayLabel>+ Add Widget</S.OverlayLabel>}
      <S.HomeIndicator />
    </S.PhoneFrame>
  );
}

function AndroidIllustration({ step }: { step: number }) {
  if (step === 2) {
    return (
      <S.PhoneFrame>
        <S.WidgetList>
          <S.WidgetListItem>
            <S.DummyAppIcon $color="#4A90E2" />
            <S.DummyAppLabel />
          </S.WidgetListItem>
          <S.WidgetListItem $highlighted>
            <S.WidgetIcon src="/whoami192.png" alt="" />
            <S.WidgetLabel>WhoAmI Today</S.WidgetLabel>
          </S.WidgetListItem>
          <S.WidgetListItem>
            <S.DummyAppIcon $color="#7ED321" />
            <S.DummyAppLabel />
          </S.WidgetListItem>
          <S.WidgetListItem>
            <S.DummyAppIcon $color="#D0021B" />
            <S.DummyAppLabel />
          </S.WidgetListItem>
        </S.WidgetList>
        <S.HomeIndicator />
      </S.PhoneFrame>
    );
  }

  return (
    <S.PhoneFrame>
      <S.AppGrid>
        {APP_DOT_IDS.map((id) => (
          <S.AppDot key={id} />
        ))}
      </S.AppGrid>
      {step === 0 && <S.EmptyAreaHighlight />}
      {step === 1 && (
        <S.BottomCard>
          <S.BottomCardItem>
            <S.BottomCardIcon />
            <S.BottomCardLabel>Wallpaper</S.BottomCardLabel>
          </S.BottomCardItem>
          <S.BottomCardItem $highlighted>
            <S.BottomCardIcon $highlighted />
            <S.BottomCardLabel $highlighted>Widgets</S.BottomCardLabel>
          </S.BottomCardItem>
          <S.BottomCardItem>
            <S.BottomCardIcon />
            <S.BottomCardLabel>Settings</S.BottomCardLabel>
          </S.BottomCardItem>
        </S.BottomCard>
      )}
      {step === 3 && (
        <S.DraggingWidget>
          <S.DraggingWidgetIcon src="/whoami192.png" alt="" />
        </S.DraggingWidget>
      )}
      <S.HomeIndicator />
    </S.PhoneFrame>
  );
}

export function PhoneIllustration({ step, platform }: { step: number; platform: Platform }) {
  if (platform === 'android') return <AndroidIllustration step={step} />;
  return <IosIllustration step={step} />;
}

function WidgetInstallGuide() {
  const [step, setStep] = useState(0);
  const { isAndroid } = getMobileDeviceInfo();
  const platform: Platform = isAndroid ? 'android' : 'ios';
  const navigate = useNavigate();
  const myProfile = useBoundStore((state) => state.myProfile);
  const [t] = useTranslation('translation', { keyPrefix: 'widget_install_guide' });

  const isLast = step === TOTAL_STEPS - 1;
  const isFirst = step === 0;

  const handleClickPrev = () => {
    if (isFirst) return;
    setStep((s) => s - 1);
  };

  const handleClickNext = () => {
    if (isLast) return;
    setStep((s) => s + 1);
  };

  const handleClickCta = () => {
    if (isLast) {
      markWidgetGuideSeen(myProfile);
      navigate('/my', { replace: true });
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <S.Container>
      <S.Title>{t('title')}</S.Title>
      <S.IllustrationWrapper>
        <S.ArrowButton onClick={handleClickPrev} disabled={isFirst} aria-label="Previous step">
          ‹
        </S.ArrowButton>
        <PhoneIllustration step={step} platform={platform} />
        <S.ArrowButton onClick={handleClickNext} disabled={isLast} aria-label="Next step">
          ›
        </S.ArrowButton>
      </S.IllustrationWrapper>
      <S.StepText>{t(`${platform}.step${step + 1}`)}</S.StepText>
      <S.Dots>
        {STEP_INDICES.map((i) => (
          <S.Dot key={`dot-${i}`} $active={i === step} />
        ))}
      </S.Dots>
      <S.CtaButton $active onClick={handleClickCta}>
        {isLast ? t('cta') : t('next')}
      </S.CtaButton>
    </S.Container>
  );
}

export default WidgetInstallGuide;
