import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { isPerFriendAnswerMap, useSurveyDraft } from '@hooks/useSurveyDraft';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import {
  ConditionalDisplay,
  PER_FRIEND_QUESTION_TYPES,
  Survey,
  SurveyAnswerInput,
  SurveyOptionValue,
  SurveyQuestion,
} from '@models/survey';
import { submitSurveyResponse } from '@utils/apis/survey';

import { ChoiceChips } from './ChoiceChips';
import { FreeTextInput } from './FreeTextInput';
import { LIKERT_NA_VALUE, LikertChips } from './LikertChips';
import { isPerFriendBlockComplete, PerFriendBlock } from './per-friend/PerFriendBlock';
import { SliderInput } from './SliderInput';

// Inclusive (min, max) per likert variant — mirrors backend
// surveys/models.py LIKERT_RANGES. Adding a new variant: extend both.
// Anything not in this map renders no input (defensive default), so
// keep this in lockstep with the backend.
const LIKERT_RANGES: Record<string, [number, number]> = {
  likert_3: [1, 3],
  likert_4: [1, 4],
  likert_5: [1, 5],
  likert_5_na: [1, 5],
  likert_6: [1, 6],
  likert_7: [1, 7],
};

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

type AnswerValue =
  | number
  | string
  | null
  | (number | string)[]
  | Record<string, number | string | null | (number | string)[]>
  | undefined;

// One renderable page: either a single question (the existing behavior)
// or a block of consecutive per_friend_* questions. Per-friend blocks
// render all friends on one scrollable page, with one PerFriendCard
// per friend grouping the friend's inputs together.
type Page =
  | { kind: 'single'; question: SurveyQuestion }
  | { kind: 'per_friend_block'; questions: SurveyQuestion[] };

function groupQuestionsIntoPages(questions: SurveyQuestion[]): Page[] {
  const pages: Page[] = [];
  let buffer: SurveyQuestion[] = [];
  const flush = () => {
    if (buffer.length > 0) {
      pages.push({ kind: 'per_friend_block', questions: buffer });
      buffer = [];
    }
  };
  questions.forEach((q) => {
    if (PER_FRIEND_QUESTION_TYPES.has(q.type)) {
      buffer.push(q);
    } else {
      flush();
      pages.push({ kind: 'single', question: q });
    }
  });
  flush();
  return pages;
}

// `null` is a meaningful answer on likert_5_na (the NA_SENTINEL — a
// recorded "not applicable" pick). `undefined` means the user hasn't
// engaged with the question yet. Treat these distinctly: hasValue and
// isAnswered both accept null as present, only undefined is "missing".
const hasValue = (value: AnswerValue): boolean => {
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const isAnswered = (question: SurveyQuestion, value: AnswerValue) => {
  if (isDisplayOnly(question)) return true;
  if (!question.required) return true;
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
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
  const { answers, setAnswer, setPerFriendAnswer, clear, hydrated } = useSurveyDraft(survey.slug);
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

  // Per-friend question types render N friends on one page. Pages are the
  // unit `index` actually iterates over so a single Back/Next press moves
  // past the entire per-friend block at once.
  const pages = useMemo(() => groupQuestionsIntoPages(questions), [questions]);
  const total = pages.length;

  const isPageAnswered = (page: Page): boolean => {
    if (page.kind === 'single') return isAnswered(page.question, answers[page.question.id]);
    return isPerFriendBlockComplete(page.questions, answers);
  };

  // Clamp index when the visible-question list shrinks (e.g. user
  // changes their category answer, removing later branches).
  useEffect(() => {
    if (total === 0) return;
    if (index > total - 1) setIndex(total - 1);
  }, [total, index]);

  // After hydration, jump to the first unanswered PAGE (or last if all answered).
  // We jump on pages, not questions, so a half-filled per-friend block lands
  // the user back on that block instead of one specific friend's row.
  useEffect(() => {
    if (!hydrated || total === 0) return;
    const firstUnanswered = pages.findIndex((p) => !isPageAnswered(p));
    setIndex(firstUnanswered === -1 ? total - 1 : firstUnanswered);
    // intentionally only run on first hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Time-per-page: emit dwell on every page change. For single-question
  // pages this preserves the per-question dwell signal; per_friend block
  // pages report a single dwell event for the whole block (we don't try
  // to subdivide a multi-friend scrolling page).
  useEffect(() => {
    if (index === previousIndexRef.current) return;
    const dwellMs = Date.now() - questionStartedAtRef.current;
    if (dwellMs >= 200 && previousIndexRef.current < pages.length) {
      const prevPage = pages[previousIndexRef.current];
      if (prevPage.kind === 'single') {
        trackEvent('survey_question_dwell', {
          survey_slug: survey.slug,
          question_id: prevPage.question.id,
          question_index: previousIndexRef.current,
          question_type: prevPage.question.type,
          duration_ms: dwellMs,
        });
      } else {
        trackEvent('survey_question_dwell', {
          survey_slug: survey.slug,
          question_id: prevPage.questions[0]?.id ?? 0,
          question_index: previousIndexRef.current,
          question_type: 'per_friend_block',
          duration_ms: dwellMs,
        });
      }
    }
    previousIndexRef.current = index;
    questionStartedAtRef.current = Date.now();
  }, [index, pages, survey.slug, trackEvent]);

  if (total === 0) return null;

  const currentPage = pages[index];
  const currentPageAnswered = isPageAnswered(currentPage);
  const allAnswered = pages.every(isPageAnswered);
  const isLast = index === total - 1;
  const currentQuestion = currentPage.kind === 'single' ? currentPage.question : null;
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleNext = () => {
    if (!currentPageAnswered) return;
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
    // Final-page dwell flush: the index-change effect above won't fire on
    // submit (we don't change index), so we manually log the time spent
    // on the last page.
    const lastDwellMs = Date.now() - questionStartedAtRef.current;
    if (lastDwellMs >= 200) {
      if (currentPage.kind === 'single') {
        trackEvent('survey_question_dwell', {
          survey_slug: survey.slug,
          question_id: currentPage.question.id,
          question_index: index,
          question_type: currentPage.question.type,
          duration_ms: lastDwellMs,
        });
      } else {
        trackEvent('survey_question_dwell', {
          survey_slug: survey.slug,
          question_id: currentPage.questions[0]?.id ?? 0,
          question_index: index,
          question_type: 'per_friend_block',
          duration_ms: lastDwellMs,
        });
      }
    }
    // Build submission payload, fanning out per-friend questions into
    // one row per (question_id, target_user_id, value). Skip display_only,
    // skip conditionally-hidden questions, skip cells with no value.
    const payload: SurveyAnswerInput[] = [];
    questions.forEach((q) => {
      if (isDisplayOnly(q)) return;
      if (PER_FRIEND_QUESTION_TYPES.has(q.type)) {
        const cell = answers[q.id];
        if (!isPerFriendAnswerMap(cell)) return;
        Object.entries(cell).forEach(([tidStr, value]) => {
          if (value === undefined) return;
          if (typeof value === 'string' && value.trim().length === 0) return;
          if (Array.isArray(value) && value.length === 0) return;
          payload.push({
            question_id: q.id,
            target_user_id: Number(tidStr),
            value: value as number | string | null | (number | string)[],
          });
        });
        return;
      }
      const value = answers[q.id];
      if (!hasValue(value as AnswerValue)) return;
      payload.push({
        question_id: q.id,
        value: value as number | string | null | (number | string)[],
      });
    });
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
        {currentPage.kind === 'per_friend_block' ? (
          <PerFriendBlock
            questions={currentPage.questions}
            answers={answers}
            setPerFriendAnswer={setPerFriendAnswer}
          />
        ) : (
          <>
            {/* display_only carries content (intro / section break) instead
                of a prompt + input. Render the content as the body and skip
                the input controls. The Next button stays enabled because
                isAnswered() returns true for display_only types. */}
            {currentQuestion && isDisplayOnly(currentQuestion) ? (
              <Typo type="body-large" color="BLACK">
                {pickLocalized(currentQuestion.content_en, currentQuestion.content_ko)}
              </Typo>
            ) : currentQuestion ? (
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
            ) : null}
          </>
        )}
        {/* All likert variants render the same way: numeric chips
            (1..max) with endpoint anchor labels. Keeps the layout
            uniform across surveys (RSDS, HEXACO, RSQ all look the
            same to the participant).
            Anchor labels resolve in this priority:
              1. Explicit low_label_* / high_label_* on the question
              2. First / last option.label when YAML provides full
                 per-option labels (RSQ-Brief style)
              3. Empty (chips render with no anchor row)
            likert_5_na keeps its N/A button below the numeric row. */}
        {currentQuestion &&
          LIKERT_RANGES[currentQuestion.type] &&
          (() => {
            const opts = [...currentQuestion.options].sort((a, b) => a.order - b.order);
            const firstOptLabel = opts[0] ? pickLocalized(opts[0].label_en, opts[0].label_ko) : '';
            const lastOptLabel =
              opts.length > 0
                ? pickLocalized(opts[opts.length - 1].label_en, opts[opts.length - 1].label_ko)
                : '';
            const explicitLow = pickLocalized(
              currentQuestion.low_label_en,
              currentQuestion.low_label_ko,
            );
            const explicitHigh = pickLocalized(
              currentQuestion.high_label_en,
              currentQuestion.high_label_ko,
            );
            return (
              <LikertChips
                min={LIKERT_RANGES[currentQuestion.type][0]}
                max={LIKERT_RANGES[currentQuestion.type][1]}
                selected={currentValue as number | null | undefined}
                onSelect={(v) => setAnswer(currentQuestion.id, v ?? LIKERT_NA_VALUE)}
                lowLabel={explicitLow || firstOptLabel}
                highLabel={explicitHigh || lastOptLabel}
                naLabel={
                  currentQuestion.type === 'likert_5_na'
                    ? pickLocalized(
                        currentQuestion.na_option_en || 'N/A',
                        currentQuestion.na_option_ko || 'N/A',
                      )
                    : undefined
                }
              />
            );
          })()}
        {currentQuestion &&
          (currentQuestion.type === 'single_choice' || currentQuestion.type === 'multi_choice') && (
            <ChoiceChips
              options={currentQuestion.options.map((o) => ({
                value: o.value,
                label: pickLocalized(o.label_en, o.label_ko),
              }))}
              multi={currentQuestion.type === 'multi_choice'}
              selected={
                (currentValue as SurveyOptionValue | SurveyOptionValue[] | undefined) ?? null
              }
              onSelect={(v) => setAnswer(currentQuestion.id, v)}
            />
          )}
        {currentQuestion && currentQuestion.type === 'free_text' && (
          <FreeTextInput
            value={(currentValue as string | undefined) ?? ''}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
            placeholder={
              pickLocalized(currentQuestion.placeholder_en, currentQuestion.placeholder_ko) ||
              (t('free_text_placeholder') ?? undefined)
            }
          />
        )}
        {currentQuestion &&
          currentQuestion.type === 'slider' &&
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
          <NavButton type="button" primary onClick={handleNext} disabled={!currentPageAnswered}>
            {t('next')}
          </NavButton>
        )}
      </NavRow>
    </Layout.FlexCol>
  );
}
