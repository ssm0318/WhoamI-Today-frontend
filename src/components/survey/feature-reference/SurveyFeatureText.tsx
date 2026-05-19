import {
  Fragment,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { ColorKeys, SvgIcon, Typo } from '@design-system';
import { FontType } from 'src/design-system/Font/Font.types';

import {
  getSurveyFeatureReference,
  parseSurveyFeatureText,
  SurveyFeatureId,
  SurveyFeatureReference,
} from './surveyFeatureReferences';
import * as S from './SurveyFeatureText.styled';

interface SurveyFeatureTextProps {
  text: string;
  surveySlug: string;
  questionSlug: string;
  type: FontType;
  color?: ColorKeys;
}

interface FeatureScreenshotModalProps {
  feature: SurveyFeatureReference;
  onClose: () => void;
}

function FeatureScreenshotModal({ feature, onClose }: FeatureScreenshotModalProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleScreenshots = feature.screenshots.length > 1;
  const lastIndex = feature.screenshots.length - 1;

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clampedIndex = Math.max(0, Math.min(lastIndex, nextIndex));
      track.scrollTo({ left: clampedIndex * track.clientWidth, behavior: 'smooth' });
      setActiveIndex(clampedIndex);
    },
    [lastIndex],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (!hasMultipleScreenshots) return;
      if (event.key === 'ArrowLeft') scrollToIndex(activeIndex - 1);
      if (event.key === 'ArrowRight') scrollToIndex(activeIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, hasMultipleScreenshots, onClose, scrollToIndex]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.max(0, Math.min(lastIndex, nextIndex)));
  };

  const stopPropagation = (event: MouseEvent) => event.stopPropagation();

  const content = (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-label={feature.canonicalName}
        onClick={stopPropagation}
      >
        <S.ModalHeader>
          <S.HeaderTitle>{feature.canonicalName}</S.HeaderTitle>
          <S.IconButton type="button" aria-label="Close screenshots" onClick={onClose}>
            <SvgIcon name="close" size={18} color="DARK_GRAY" />
          </S.IconButton>
        </S.ModalHeader>

        <S.ScreenshotFrame>
          {hasMultipleScreenshots && (
            <>
              <S.CarouselCounter aria-live="polite">
                {activeIndex + 1} / {feature.screenshots.length}
              </S.CarouselCounter>
              <S.CarouselNavButton
                type="button"
                aria-label="Show previous screenshot"
                $side="left"
                disabled={activeIndex === 0}
                onClick={() => scrollToIndex(activeIndex - 1)}
              >
                <SvgIcon name="arrow_left" size={24} color="BLACK" />
              </S.CarouselNavButton>
              <S.CarouselNavButton
                type="button"
                aria-label="Show next screenshot"
                $side="right"
                disabled={activeIndex === lastIndex}
                onClick={() => scrollToIndex(activeIndex + 1)}
              >
                <SvgIcon name="arrow_right" size={24} color="BLACK" />
              </S.CarouselNavButton>
            </>
          )}

          <S.ScreenshotTrack ref={trackRef} onScroll={handleScroll}>
            {feature.screenshots.map((screenshot) => (
              <S.ScreenshotSlide key={screenshot.src}>
                <S.ScreenshotImage src={screenshot.src} alt={screenshot.alt} />
                {screenshot.caption && <S.Caption>{screenshot.caption}</S.Caption>}
              </S.ScreenshotSlide>
            ))}
          </S.ScreenshotTrack>
        </S.ScreenshotFrame>

        {hasMultipleScreenshots && (
          <S.Dots aria-label={`${feature.canonicalName} screenshots`}>
            {feature.screenshots.map((screenshot, idx) => (
              <S.Dot
                key={screenshot.src}
                type="button"
                $active={idx === activeIndex}
                aria-label={`Show screenshot ${idx + 1}`}
                onClick={() => scrollToIndex(idx)}
              />
            ))}
          </S.Dots>
        )}
      </S.ModalCard>
    </S.ModalOverlay>
  );

  return createPortal(content, document.body);
}

export function SurveyFeatureText({
  text,
  surveySlug,
  questionSlug,
  type,
  color = 'BLACK',
}: SurveyFeatureTextProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<SurveyFeatureId | null>(null);
  const segments = useMemo(
    () => parseSurveyFeatureText(text, { surveySlug, questionSlug }),
    [questionSlug, surveySlug, text],
  );
  const selectedFeature = selectedFeatureId ? getSurveyFeatureReference(selectedFeatureId) : null;

  const renderSegment = (node: ReactNode, key: string, bold: boolean): ReactNode => {
    if (bold) return <strong key={key}>{node}</strong>;
    return <Fragment key={key}>{node}</Fragment>;
  };

  return (
    <>
      <Typo type={type} color={color}>
        {segments.map((segment, idx) =>
          renderSegment(
            segment.featureId ? (
              <S.FeatureTrigger
                type="button"
                aria-label={`View ${segment.text} screenshots`}
                onClick={() => setSelectedFeatureId(segment.featureId ?? null)}
              >
                {segment.text}
              </S.FeatureTrigger>
            ) : (
              segment.text
            ),
            `${segment.text}-${idx}`,
            segment.bold,
          ),
        )}
      </Typo>
      {selectedFeature && (
        <FeatureScreenshotModal
          feature={selectedFeature}
          onClose={() => setSelectedFeatureId(null)}
        />
      )}
    </>
  );
}
