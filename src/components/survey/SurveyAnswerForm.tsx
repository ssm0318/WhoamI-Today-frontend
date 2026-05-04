import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { useSurveyDraft } from '@hooks/useSurveyDraft';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import {
  ConditionalDisplay,
  LIKERT_RANGES,
  Survey,
  SurveyAnswerInput,
  SurveyQuestion,
} from '@models/survey';
import { submitSurveyResponse } from '@utils/apis/survey';

import { ChoiceChips } from './ChoiceChips';
import { DisplayOnlyBlock } from './DisplayOnlyBlock';
import { FreeTextInput } from './FreeTextInput';
import { LikertChips } from './LikertChips';
import { Markdown } from './Markdown';
import { SliderInput } from './SliderInput';

// Sentinel stored in the draft answer map for likert_5_na N/A picks.
// Distinct from `undefined` (unanswered) so the form can tell the user has
// chosen N/A and the Next button can advance. Mapped to null at submit time
// (which is the API's NA_SENTINEL).
const LIKERT_NA_SENTINEL = -1;

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

const WarningText = styled.div`
  width: 100%;
  color: ${Colors.WARNING};
  font-size: 14px;
`;

interface SurveyAnswerFormProps {
  survey: Survey;
  onSubmitted: () => void;
  onError?: (message: string) => void;
}

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const isLikertType = (t: SurveyQuestion['type']): t is keyof typeof LIKERT_RANGES =>
  t in LIKERT_RANGES;

// True when the user has provided a value the form can submit. display_only
// blocks don't take input, so they're trivially "answered" at the form
// level. Optional questions with no value are also "answered" — they just
// submit nothing. likert_5_na N/A picks (LIKERT_NA_SENTINEL) count as
// answered so the user can advance past the question.
function isAnswered(question: SurveyQuestion, value: unknown): boolean {
  if (question.type === 'display_only') return true;
  if (!question.required && (value === undefined || value === null)) return true;
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

// Conditional display: a question is hidden when its `conditional_display`
// rule references a prior question whose answer doesn't match. Hidden
// questions skip submission validation entirely (their `required: true` is
// effectively ignored when not displayed).
function isVisible(question: SurveyQuestion, answersBySlug: Map<string, unknown>): boolean {
  const cd: ConditionalDisplay | undefined = question.conditional_display;
  if (!cd || !cd.depends_on) return true;
  const triggerValue = answersBySlug.get(cd.depends_on);
  // If the triggering question hasn't been answered yet, hide until it has.
  if (triggerValue === undefined) return false;

  if ('show_when_value' in cd) {
    return triggerValue === cd.show_when_value;
  }
  if ('show_when_value_not' in cd) {
    return triggerValue !== cd.show_when_value_not;
  }
  if ('show_when_value_in' in cd && Array.isArray(cd.show_when_value_in)) {
    return cd.show_when_value_in.includes(triggerValue as never);
  }
  if ('show_when_value_includes' in cd) {
    return (
      Array.isArray(triggerValue) && triggerValue.includes(cd.show_when_value_includes as never)
    );
  }
  return true;
}

export function SurveyAnswerForm({ survey, onSubmitted, onError }: SurveyAnswerFormProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const { answers, setAnswer, clear, hydrated } = useSurveyDraft(survey.slug);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const trackEvent = useTrackEvent();
  const questionStartedAtRef = useRef<number>(Date.now());
  const previousIndexRef = useRef<number>(0);

  // Sort once + memo the slug → answer lookup that conditional_display needs.
  const allQuestions = useMemo(
    () => [...survey.questions].sort((a, b) => a.order - b.order),
    [survey.questions],
  );
  const answersBySlug = useMemo(() => {
    const m = new Map<string, unknown>();
    allQuestions.forEach((q) => {
      if (q.slug) m.set(q.slug, answers[q.id]);
    });
    return m;
  }, [allQuestions, answers]);

  // Visible questions = the actual flow the user sees. Hidden questions are
  // skipped both in navigation and in submit-validation.
  const visibleQuestions = useMemo(
    () => allQuestions.filter((q) => isVisible(q, answersBySlug)),
    [allQuestions, answersBySlug],
  );
  const total = visibleQuestions.length;

  // Clamp index when the visible set shrinks (e.g. answering a trigger
  // question that hides later items) so we never point past the end.
  useEffect(() => {
    if (index >= total && total > 0) setIndex(total - 1);
  }, [index, total]);

  // After hydration, jump to the first unanswered visible question (or last if all answered).
  useEffect(() => {
    if (!hydrated || total === 0) return;
    const firstUnanswered = visibleQuestions.findIndex((q) => !isAnswered(q, answers[q.id]));
    setIndex(firstUnanswered === -1 ? total - 1 : firstUnanswered);
    // intentionally only run on first hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Time-per-question dwell tracking — same as before, scoped to the visible
  // question stream.
  useEffect(() => {
    if (index === previousIndexRef.current) return;
    const dwellMs = Date.now() - questionStartedAtRef.current;
    if (dwellMs >= 200 && previousIndexRef.current < visibleQuestions.length) {
      const prevQ = visibleQuestions[previousIndexRef.current];
      trackEvent('survey_question_dwell', {
        survey_slug: survey.slug,
        question_id: prevQ.id,
        question_index: previousIndexRef.current,
        question_type: prevQ.type,
        duration_ms: dwellMs,
      });
    }
    previousIndexRef.current = index;
    questionStartedAtRef.current = Date.now();
  }, [index, visibleQuestions, survey.slug, trackEvent]);

  if (total === 0) return null;

  const currentQuestion = visibleQuestions[index];
  const currentValue = answers[currentQuestion.id];
  const currentAnswered = isAnswered(currentQuestion, currentValue);
  const allAnswered = visibleQuestions.every((q) => isAnswered(q, answers[q.id]));
  const isLast = index === total - 1;

  // Free-text min_length is a soft warning — the user can submit anyway,
  // we just nudge once.
  const showMinLengthWarning =
    currentQuestion.type === 'free_text' &&
    currentQuestion.min_length != null &&
    currentQuestion.min_length > 0 &&
    typeof currentValue === 'string' &&
    currentValue.trim().length > 0 &&
    currentValue.trim().length < currentQuestion.min_length;

  const handleNext = () => {
    if (!currentAnswered) return;
    if (!isLast) {
      trackEvent('survey_navigated', {
        survey_slug: survey.slug,
        direction: 'next',
        from_index: index,
      });
      setIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      trackEvent('survey_navigated', {
        survey_slug: survey.slug,
        direction: 'back',
        from_index: index,
      });
      setIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const lastDwellMs = Date.now() - questionStartedAtRef.current;
    if (lastDwellMs >= 200 && currentQuestion) {
      trackEvent('survey_question_dwell', {
        survey_slug: survey.slug,
        question_id: currentQuestion.id,
        question_index: index,
        question_type: currentQuestion.type,
        duration_ms: lastDwellMs,
      });
    }
    // Build the API payload from visible questions only — hidden conditional
    // questions are excluded entirely (no row sent). display_only blocks have
    // no value to send. likert_5_na N/A sentinel maps back to null.
    const payload: SurveyAnswerInput[] = visibleQuestions
      .filter((q) => q.type !== 'display_only')
      .map((q) => {
        const raw = answers[q.id];
        const value =
          q.type === 'likert_5_na' && raw === LIKERT_NA_SENTINEL
            ? null
            : raw === undefined
            ? null
            : (raw as SurveyAnswerInput['value']);
        return { question_id: q.id, value };
      });
    try {
      await submitSurveyResponse(survey.slug, payload);
      trackEvent('survey_submitted', {
        survey_slug: survey.slug,
        question_count: visibleQuestions.length,
      });
      clear();
      onSubmitted();
    } catch {
      if (onError) onError(t('toast.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((index + 1) / total) * 100;
  const description = pickLocalized(currentQuestion.description_en, currentQuestion.description_ko);
  const placeholder = pickLocalized(currentQuestion.placeholder_en, currentQuestion.placeholder_ko);

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

      <Layout.FlexCol gap={8} w="100%">
        {currentQuestion.type !== 'display_only' && (
          <Typo type="title-medium" color="BLACK">
            {pickLocalized(currentQuestion.prompt_en, currentQuestion.prompt_ko)}
          </Typo>
        )}
        {description && currentQuestion.type !== 'display_only' && (
          <Markdown source={description} />
        )}

        {currentQuestion.type === 'display_only' && (
          <DisplayOnlyBlock
            content={pickLocalized(currentQuestion.content_en, currentQuestion.content_ko)}
          />
        )}

        {isLikertType(currentQuestion.type) && (
          <LikertChips
            selected={(currentValue as number | undefined) ?? null}
            onSelect={(v) => setAnswer(currentQuestion.id, v)}
            min={LIKERT_RANGES[currentQuestion.type][0]}
            max={LIKERT_RANGES[currentQuestion.type][1]}
            lowLabel={pickLocalized(currentQuestion.low_label_en, currentQuestion.low_label_ko)}
            highLabel={pickLocalized(currentQuestion.high_label_en, currentQuestion.high_label_ko)}
            naLabel={
              currentQuestion.type === 'likert_5_na'
                ? pickLocalized(currentQuestion.na_option_en, currentQuestion.na_option_ko) || 'N/A'
                : undefined
            }
          />
        )}
        {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'multi_choice') && (
          <ChoiceChips
            options={currentQuestion.options.map((o) => ({
              value: o.value,
              label: pickLocalized(o.label_en, o.label_ko),
            }))}
            multi={currentQuestion.type === 'multi_choice'}
            selected={(currentValue as number | string | number[] | string[] | undefined) ?? null}
            onSelect={(v) => setAnswer(currentQuestion.id, v)}
          />
        )}
        {currentQuestion.type === 'free_text' && (
          <FreeTextInput
            value={(currentValue as string | undefined) ?? ''}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
            placeholder={placeholder || (t('free_text_placeholder') ?? undefined)}
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

        {showMinLengthWarning && (
          <WarningText>
            <Markdown
              source={
                pickLocalized(
                  currentQuestion.min_length_warning_en,
                  currentQuestion.min_length_warning_ko,
                ) || ''
              }
            />
          </WarningText>
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
