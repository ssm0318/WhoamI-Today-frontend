import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { useSurveyDraft } from '@hooks/useSurveyDraft';
import i18n from '@i18n/index';
import { Survey, SurveyAnswerInput } from '@models/survey';
import { submitSurveyResponse } from '@utils/apis/survey';

import { ChoiceChips } from './ChoiceChips';
import { FreeTextInput } from './FreeTextInput';
import { LikertChips } from './LikertChips';
import { SliderInput } from './SliderInput';

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 4px;
  background: ${Colors.LIGHT_GRAY};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ pct: number }>`
  height: 100%;
  width: ${({ pct }) => pct}%;
  background: ${Colors.PRIMARY};
  border-radius: 2px;
  transition: width 200ms ease-out;
`;

const NavRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
  margin-top: 16px;
`;

const NavButton = styled.button<{ disabled: boolean; primary?: boolean }>`
  border: 1px solid
    ${({ disabled, primary }) => {
      if (disabled) return Colors.LIGHT_GRAY;
      return primary ? Colors.PRIMARY : Colors.LIGHT_GRAY;
    }};
  border-radius: 12px;
  padding: 8px 16px;
  background: ${({ disabled, primary }) => {
    if (disabled) return Colors.LIGHT;
    return primary ? Colors.PRIMARY : Colors.WHITE;
  }};
  color: ${({ disabled, primary }) => {
    if (disabled) return Colors.MEDIUM_GRAY;
    return primary ? Colors.WHITE : Colors.BLACK;
  }};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  -webkit-tap-highlight-color: transparent;
  font-size: 14px;
`;

interface SurveyAnswerFormProps {
  survey: Survey;
  onSubmitted: () => void;
  onError?: (message: string) => void;
}

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const isAnswered = (value: number | number[] | string | undefined) => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export function SurveyAnswerForm({ survey, onSubmitted, onError }: SurveyAnswerFormProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const { answers, setAnswer, clear, hydrated } = useSurveyDraft(survey.slug);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const questions = useMemo(
    () => [...survey.questions].sort((a, b) => a.order - b.order),
    [survey.questions],
  );
  const total = questions.length;

  // After hydration, jump to the first unanswered question (or last if all answered)
  useEffect(() => {
    if (!hydrated || total === 0) return;
    const firstUnanswered = questions.findIndex((q) => !isAnswered(answers[q.id]));
    setIndex(firstUnanswered === -1 ? total - 1 : firstUnanswered);
    // intentionally only run on first hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (total === 0) return null;

  const currentQuestion = questions[index];
  const currentValue = answers[currentQuestion.id];
  const currentAnswered = isAnswered(currentValue);
  const allAnswered = questions.every((q) => isAnswered(answers[q.id]));
  const isLast = index === total - 1;

  const handleNext = () => {
    if (!currentAnswered) return;
    if (!isLast) setIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const payload: SurveyAnswerInput[] = questions.map((q) => ({
      question_id: q.id,
      value: answers[q.id],
    }));
    try {
      await submitSurveyResponse(survey.slug, payload);
      clear();
      onSubmitted();
    } catch {
      if (onError) onError(t('toast.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((index + 1) / total) * 100;

  return (
    <Layout.FlexCol gap={12} w="100%">
      <Layout.FlexCol gap={6} w="100%">
        <Typo type="label-medium" color="DARK_GRAY">
          {t('question_progress', { current: index + 1, total })}
        </Typo>
        <ProgressBarTrack>
          <ProgressBarFill pct={progressPct} />
        </ProgressBarTrack>
      </Layout.FlexCol>

      <Layout.FlexCol gap={6} w="100%">
        <Typo type="title-medium" color="BLACK">
          {pickLocalized(currentQuestion.prompt_en, currentQuestion.prompt_ko)}
        </Typo>
        {currentQuestion.type === 'likert_5' && (
          <LikertChips
            selected={(currentValue as number | undefined) ?? null}
            onSelect={(v) => setAnswer(currentQuestion.id, v)}
            lowLabel={pickLocalized(currentQuestion.low_label_en, currentQuestion.low_label_ko)}
            highLabel={pickLocalized(currentQuestion.high_label_en, currentQuestion.high_label_ko)}
          />
        )}
        {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'multi_choice') && (
          <ChoiceChips
            options={currentQuestion.options.map((o) => ({
              value: o.value,
              label: pickLocalized(o.label_en, o.label_ko),
            }))}
            multi={currentQuestion.type === 'multi_choice'}
            selected={(currentValue as number | number[] | undefined) ?? null}
            onSelect={(v) => setAnswer(currentQuestion.id, v)}
          />
        )}
        {currentQuestion.type === 'free_text' && (
          <FreeTextInput
            value={(currentValue as string | undefined) ?? ''}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
            placeholder={t('free_text_placeholder') ?? undefined}
          />
        )}
        {currentQuestion.type === 'slider' &&
          currentQuestion.slider_min_value !== null &&
          currentQuestion.slider_max_value !== null && (
            <SliderInput
              min={currentQuestion.slider_min_value}
              max={currentQuestion.slider_max_value}
              value={currentValue as number | undefined}
              onChange={(v) => setAnswer(currentQuestion.id, v)}
              lowLabel={pickLocalized(currentQuestion.low_label_en, currentQuestion.low_label_ko)}
              highLabel={pickLocalized(
                currentQuestion.high_label_en,
                currentQuestion.high_label_ko,
              )}
            />
          )}
      </Layout.FlexCol>

      <NavRow>
        <NavButton type="button" onClick={handleBack} disabled={index === 0}>
          {t('back')}
        </NavButton>
        {isLast ? (
          <NavButton
            type="button"
            primary
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {t('submit')}
          </NavButton>
        ) : (
          <NavButton type="button" primary onClick={handleNext} disabled={!currentAnswered}>
            {t('next')}
          </NavButton>
        )}
      </NavRow>
    </Layout.FlexCol>
  );
}
