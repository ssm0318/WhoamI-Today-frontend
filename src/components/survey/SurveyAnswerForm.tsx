import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { useSurveyDraft } from '@hooks/useSurveyDraft';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import {
  ConditionalDisplay,
  Survey,
  SurveyAnswerInput,
  SurveyOptionValue,
  SurveyQuestion,
} from '@models/survey';
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

// display_only carries no answer; treat it as "answered" for navigation
// purposes so the user can advance past intro / section-break cards.
const isDisplayOnly = (q: SurveyQuestion) => q.type === 'display_only';

type AnswerValue = number | string | (number | string)[] | undefined;

const isAnswered = (question: SurveyQuestion, value: AnswerValue) => {
  if (isDisplayOnly(question)) return true;
  if (!question.required) return true;
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

// Evaluate a conditional_display rule against the controlling question's
// current answer. Returns true when the question SHOULD be shown.
// Unknown / missing dependency slug fails open (visible) — defensive
// against author typos so the survey never silently skips everything.
const evaluateCondition = (rule: ConditionalDisplay, controllerValue: AnswerValue): boolean => {
  if (controllerValue === undefined || controllerValue === null) return false;
  if (rule.show_when_value !== undefined) {
    return controllerValue === rule.show_when_value;
  }
  if (rule.show_when_value_not !== undefined) {
    return controllerValue !== rule.show_when_value_not;
  }
  if (rule.show_when_value_in !== undefined) {
    return rule.show_when_value_in.includes(controllerValue as SurveyOptionValue);
  }
  if (rule.show_when_value_includes !== undefined) {
    if (!Array.isArray(controllerValue)) return false;
    return (controllerValue as SurveyOptionValue[]).includes(rule.show_when_value_includes);
  }
  return true;
};

export function SurveyAnswerForm({ survey, onSubmitted, onError }: SurveyAnswerFormProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const { answers, setAnswer, clear, hydrated } = useSurveyDraft(survey.slug);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const trackEvent = useTrackEvent();
  // Time-on-question stamp. Reset every time the displayed question
  // changes so we can attribute "how long did the user spend deciding
  // their answer" to the question they actually saw. The post-render
  // useEffect resets this; manual nav handlers also touch it.
  const questionStartedAtRef = useRef<number>(Date.now());
  const previousIndexRef = useRef<number>(0);

  const allQuestions = useMemo(
    () => [...survey.questions].sort((a, b) => a.order - b.order),
    [survey.questions],
  );

  // Filter to currently-visible questions based on conditional_display.
  // Re-runs whenever a controlling answer changes (e.g. selecting a
  // category in anytime_reflection swaps which follow-up questions show).
  // Resolves `depends_on` (slug) to the controlling question's id, then
  // looks up that id's answer.
  const questions = useMemo(() => {
    const bySlug = new Map<string, SurveyQuestion>();
    allQuestions.forEach((q) => {
      if (q.slug) bySlug.set(q.slug, q);
    });
    return allQuestions.filter((q) => {
      if (!q.conditional_display) return true;
      const controller = bySlug.get(q.conditional_display.depends_on);
      // Missing dependency slug: fail open (show) so author typos don't
      // silently make the rest of the survey vanish.
      if (!controller) return true;
      return evaluateCondition(q.conditional_display, answers[controller.id]);
    });
  }, [allQuestions, answers]);
  const total = questions.length;

  // Clamp index when the visible-question list shrinks (e.g. user
  // changes their category answer, removing later branches).
  useEffect(() => {
    if (total === 0) return;
    if (index > total - 1) setIndex(total - 1);
  }, [total, index]);

  // After hydration, jump to the first unanswered question (or last if all answered)
  useEffect(() => {
    if (!hydrated || total === 0) return;
    const firstUnanswered = questions.findIndex((q) => !isAnswered(q, answers[q.id]));
    setIndex(firstUnanswered === -1 ? total - 1 : firstUnanswered);
    // intentionally only run on first hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Time-per-question: emit dwell on every index change. Captures the
  // ACTUAL viewing time of the previous question, which the back/next
  // handlers below can't report on their own (they don't know how long
  // the question was visible vs answered earlier). Backend only sees
  // the final batched submit — per-question timing is invisible there.
  useEffect(() => {
    if (index === previousIndexRef.current) return;
    const dwellMs = Date.now() - questionStartedAtRef.current;
    if (dwellMs >= 200 && previousIndexRef.current < questions.length) {
      const prevQ = questions[previousIndexRef.current];
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
  }, [index, questions, survey.slug, trackEvent]);

  if (total === 0) return null;

  const currentQuestion = questions[index];
  const currentValue = answers[currentQuestion.id];
  const currentAnswered = isAnswered(currentQuestion, currentValue);
  const allAnswered = questions.every((q) => isAnswered(q, answers[q.id]));
  const isLast = index === total - 1;

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
      // Back-tap is a stronger signal than next-tap: it means the user
      // wants to revise an earlier answer. High back-rate per question
      // = ambiguous wording or hard decision.
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
    // Final-question dwell flush: the index-change effect above won't
    // fire on submit (we don't change index), so we have to manually log
    // the time spent on the last question.
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
    // Only submit answers for visible non-display-only questions.
    // display_only carries no value, and conditionally-hidden questions
    // shouldn't pollute the response with stale values from a discarded
    // branch (e.g. user picked "bug" then changed to "feature_request").
    const payload: SurveyAnswerInput[] = questions
      .filter((q) => !isDisplayOnly(q))
      .map((q) => ({
        question_id: q.id,
        value: answers[q.id],
      }));
    try {
      await submitSurveyResponse(survey.slug, payload);
      // Backend captures the response, but a typed `survey_submitted`
      // event keeps Firebase funnels symmetric with `survey_navigated`.
      trackEvent('survey_submitted', {
        survey_slug: survey.slug,
        question_count: questions.length,
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
        {/* display_only carries content (intro / section break) instead
            of a prompt + input. Render the content as the body and skip
            the input controls. The Next button stays enabled because
            isAnswered() returns true for display_only types. */}
        {isDisplayOnly(currentQuestion) ? (
          <Typo type="body-large" color="BLACK">
            {pickLocalized(currentQuestion.content_en, currentQuestion.content_ko)}
          </Typo>
        ) : (
          <>
            <Typo type="title-medium" color="BLACK">
              {pickLocalized(currentQuestion.prompt_en, currentQuestion.prompt_ko)}
            </Typo>
            {(currentQuestion.description_en || currentQuestion.description_ko) && (
              <Typo type="body-medium" color="DARK_GRAY">
                {pickLocalized(currentQuestion.description_en, currentQuestion.description_ko)}
              </Typo>
            )}
          </>
        )}
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
            selected={(currentValue as SurveyOptionValue | SurveyOptionValue[] | undefined) ?? null}
            onSelect={(v) => setAnswer(currentQuestion.id, v)}
          />
        )}
        {currentQuestion.type === 'free_text' && (
          <FreeTextInput
            value={(currentValue as string | undefined) ?? ''}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
            placeholder={
              pickLocalized(currentQuestion.placeholder_en, currentQuestion.placeholder_ko) ||
              (t('free_text_placeholder') ?? undefined)
            }
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
