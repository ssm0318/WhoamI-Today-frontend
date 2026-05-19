import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { useSurveyDraft } from '@hooks/useSurveyDraft';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import { Survey, SurveyOptionValue, SurveyQuestion, SurveySubmitResponse } from '@models/survey';
import { deleteSurveyDraft, submitSurveyResponse } from '@utils/apis/survey';

import { ChoiceChips } from './ChoiceChips';
import { SurveyFeatureText } from './feature-reference/SurveyFeatureText';
import { FreeTextInput } from './FreeTextInput';
import { LIKERT_NA_VALUE, LikertChips } from './LikertChips';
import { PerFriendBlock } from './per-friend/PerFriendBlock';
import { SliderInput } from './SliderInput';
import {
  getInitialSurveyPageIndex,
  groupQuestionsIntoPages,
  isDisplayOnly,
  isSurveyPageAnswered,
} from './surveyPageResume';
import type { SurveyPage } from './surveyPageResume';
import { getVisibleSurveyQuestions } from './surveyQuestionVisibility';
import { buildSurveyAnswerPayload } from './surveySubmitPayload';

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
  onSubmitted: (result: SurveySubmitResponse) => void;
  onError?: (message: string) => void;
}

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const getPageTrackingQuestionId = (page: SurveyPage) =>
  page.kind === 'single' ? page.question.id : page.questions[0]?.id ?? 0;

const getPageTrackingQuestionType = (page: SurveyPage) =>
  page.kind === 'single' ? page.question.type : page.kind;

export function SurveyAnswerForm({ survey, onSubmitted, onError }: SurveyAnswerFormProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const {
    answers,
    metadata,
    setAnswer,
    setPerFriendAnswer,
    updateProgressMetadata,
    clear,
    hydrated,
  } = useSurveyDraft(survey.slug, survey.draft);
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
    return getVisibleSurveyQuestions(allQuestions, answers);
  }, [allQuestions, answers]);

  // Per-friend question types render N friends on one page. Pages are the
  // unit `index` actually iterates over so a single Back/Next press moves
  // past the entire per-friend block at once.
  const pages = useMemo(() => groupQuestionsIntoPages(questions), [questions]);
  const total = pages.length;

  const isPageAnswered = (page: SurveyPage): boolean => isSurveyPageAnswered(page, answers);
  const answeredPages = useMemo(
    () => pages.filter((page) => isSurveyPageAnswered(page, answers)).length,
    [answers, pages],
  );
  const answerProgressPct = total > 0 ? Math.round((answeredPages / total) * 100) : 0;

  // Clamp index when the visible-question list shrinks (e.g. user
  // changes their category answer, removing later branches).
  useEffect(() => {
    if (total === 0) return;
    if (index > total - 1) setIndex(total - 1);
  }, [total, index]);

  // After hydration, resume only when a real draft answer exists. A fresh
  // survey must start at page 1 even when that page is display_only intro
  // copy, because the intro is part of the participant-facing flow.
  useEffect(() => {
    if (!hydrated || total === 0) return;
    const canUseSavedPage =
      metadata.totalPages === total &&
      metadata.currentPageIndex >= 0 &&
      metadata.currentPageIndex < total &&
      Object.keys(answers).length > 0;
    setIndex(
      canUseSavedPage ? metadata.currentPageIndex : getInitialSurveyPageIndex(questions, answers),
    );
    // intentionally only run on first hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || total === 0) return;
    updateProgressMetadata({
      currentPageIndex: index,
      totalPages: total,
      answeredPages,
      progressPct: answerProgressPct,
    });
  }, [answerProgressPct, answeredPages, hydrated, index, total, updateProgressMetadata]);

  // Time-per-page: emit dwell on every page change. For single-question
  // pages this preserves the per-question dwell signal; per_friend block
  // pages report a single dwell event for the whole block (we don't try
  // to subdivide a multi-friend scrolling page).
  useEffect(() => {
    if (index === previousIndexRef.current) return;
    const dwellMs = Date.now() - questionStartedAtRef.current;
    if (dwellMs >= 200 && previousIndexRef.current < pages.length) {
      const prevPage = pages[previousIndexRef.current];
      trackEvent('survey_question_dwell', {
        survey_slug: survey.slug,
        question_id: getPageTrackingQuestionId(prevPage),
        question_index: previousIndexRef.current,
        question_type: getPageTrackingQuestionType(prevPage),
        duration_ms: dwellMs,
      });
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

  const renderQuestionFields = (question: SurveyQuestion) => {
    const value = answers[question.id];
    return (
      <Layout.FlexCol key={question.id} gap={6} w="100%">
        {/* display_only carries content (intro / section break) instead
            of a prompt + input. Render the content as the body and skip
            the input controls. The Next button stays enabled because
            isAnswered() returns true for display_only types. */}
        {isDisplayOnly(question) ? (
          <SurveyFeatureText
            text={pickLocalized(question.content_en, question.content_ko)}
            surveySlug={survey.slug}
            questionSlug={question.slug}
            type="body-large"
            color="BLACK"
          />
        ) : (
          <>
            <SurveyFeatureText
              text={pickLocalized(question.prompt_en, question.prompt_ko)}
              surveySlug={survey.slug}
              questionSlug={question.slug}
              type="title-medium"
              color="BLACK"
            />
            {(question.description_en || question.description_ko) && (
              <SurveyFeatureText
                text={pickLocalized(question.description_en, question.description_ko)}
                surveySlug={survey.slug}
                questionSlug={question.slug}
                type="body-medium"
                color="DARK_GRAY"
              />
            )}
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
        {LIKERT_RANGES[question.type] &&
          (() => {
            const opts = [...question.options].sort((a, b) => a.order - b.order);
            const firstOptLabel = opts[0] ? pickLocalized(opts[0].label_en, opts[0].label_ko) : '';
            const lastOptLabel =
              opts.length > 0
                ? pickLocalized(opts[opts.length - 1].label_en, opts[opts.length - 1].label_ko)
                : '';
            const explicitLow = pickLocalized(question.low_label_en, question.low_label_ko);
            const explicitHigh = pickLocalized(question.high_label_en, question.high_label_ko);
            return (
              <LikertChips
                min={LIKERT_RANGES[question.type][0]}
                max={LIKERT_RANGES[question.type][1]}
                selected={value as number | null | undefined}
                onSelect={(v) => setAnswer(question.id, v ?? LIKERT_NA_VALUE)}
                lowLabel={explicitLow || firstOptLabel}
                highLabel={explicitHigh || lastOptLabel}
                naLabel={
                  question.type === 'likert_5_na'
                    ? pickLocalized(question.na_option_en || 'N/A', question.na_option_ko || 'N/A')
                    : undefined
                }
              />
            );
          })()}
        {(question.type === 'single_choice' || question.type === 'multi_choice') && (
          <ChoiceChips
            options={question.options.map((o) => ({
              value: o.value,
              label: pickLocalized(o.label_en, o.label_ko),
            }))}
            multi={question.type === 'multi_choice'}
            selected={(value as SurveyOptionValue | SurveyOptionValue[] | undefined) ?? null}
            onSelect={(v) => setAnswer(question.id, v)}
          />
        )}
        {question.type === 'free_text' && (
          <FreeTextInput
            value={(value as string | undefined) ?? ''}
            onChange={(v) => setAnswer(question.id, v)}
            placeholder={
              pickLocalized(question.placeholder_en, question.placeholder_ko) ||
              (t('free_text_placeholder') ?? undefined)
            }
          />
        )}
        {question.type === 'slider' &&
          question.slider_min_value !== null &&
          question.slider_max_value !== null && (
            <SliderInput
              min={question.slider_min_value}
              max={question.slider_max_value}
              value={value as number | undefined}
              onChange={(v) => setAnswer(question.id, v)}
              lowLabel={pickLocalized(question.low_label_en, question.low_label_ko)}
              highLabel={pickLocalized(question.high_label_en, question.high_label_ko)}
            />
          )}
      </Layout.FlexCol>
    );
  };

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
      trackEvent('survey_question_dwell', {
        survey_slug: survey.slug,
        question_id: getPageTrackingQuestionId(currentPage),
        question_index: index,
        question_type: getPageTrackingQuestionType(currentPage),
        duration_ms: lastDwellMs,
      });
    }
    const payload = buildSurveyAnswerPayload(questions, answers);
    try {
      const result = await submitSurveyResponse(survey.slug, payload);
      // Backend captures the response, but a typed `survey_submitted`
      // event keeps Firebase funnels symmetric with `survey_navigated`.
      trackEvent('survey_submitted', {
        survey_slug: survey.slug,
        question_count: questions.length,
      });
      clear();
      deleteSurveyDraft(survey.slug).catch(() => undefined);
      onSubmitted(result);
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
        ) : currentPage.kind === 'feature_block' ? (
          currentPage.questions.map(renderQuestionFields)
        ) : (
          currentQuestion && renderQuestionFields(currentQuestion)
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
