import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { Survey, SurveyAnswerInput } from '@models/survey';
import { submitSurveyResponse } from '@utils/apis/survey';

import { ChoiceChips } from './ChoiceChips';
import { LikertChips } from './LikertChips';

const SubmitButton = styled.button<{ disabled: boolean }>`
  margin-top: 12px;
  align-self: flex-start;
  border: 1px solid ${({ disabled }) => (disabled ? Colors.LIGHT_GRAY : Colors.PRIMARY)};
  border-radius: 12px;
  padding: 8px 16px;
  background: ${({ disabled }) => (disabled ? Colors.LIGHT : Colors.PRIMARY)};
  color: ${({ disabled }) => (disabled ? Colors.MEDIUM_GRAY : Colors.WHITE)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  -webkit-tap-highlight-color: transparent;
`;

interface SurveyAnswerFormProps {
  survey: Survey;
  onSubmitted: () => void;
  onError?: (message: string) => void;
}

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

export function SurveyAnswerForm({ survey, onSubmitted, onError }: SurveyAnswerFormProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const [draft, setDraft] = useState<Record<number, number | number[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const allAnswered =
    survey.questions.length > 0 &&
    survey.questions.every((q) => {
      const v = draft[q.id];
      if (v === undefined) return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    });

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    const answers: SurveyAnswerInput[] = survey.questions.map((q) => ({
      question_id: q.id,
      value: draft[q.id],
    }));
    setSubmitting(true);
    try {
      await submitSurveyResponse(survey.slug, answers);
      onSubmitted();
    } catch (e) {
      if (onError) onError(t('toast.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout.FlexCol gap={12} w="100%">
      {survey.questions.map((q) => (
        <Layout.FlexCol key={q.id} gap={6} w="100%">
          <Typo type="body-medium" color="BLACK">
            {pickLocalized(q.prompt_en, q.prompt_ko)}
          </Typo>
          {survey.type === 'likert_5' && (
            <LikertChips
              selected={(draft[q.id] as number | undefined) ?? null}
              onSelect={(v) => setDraft((d) => ({ ...d, [q.id]: v }))}
              lowLabel={pickLocalized(q.low_label_en, q.low_label_ko)}
              highLabel={pickLocalized(q.high_label_en, q.high_label_ko)}
            />
          )}
          {(survey.type === 'single_choice' || survey.type === 'multi_choice') && (
            <ChoiceChips
              options={q.options.map((o) => ({
                value: o.value,
                label: pickLocalized(o.label_en, o.label_ko),
              }))}
              multi={survey.type === 'multi_choice'}
              selected={draft[q.id] ?? null}
              onSelect={(v) => setDraft((d) => ({ ...d, [q.id]: v }))}
            />
          )}
        </Layout.FlexCol>
      ))}
      <SubmitButton type="button" onClick={handleSubmit} disabled={!allAnswered || submitting}>
        {t('submit')}
      </SubmitButton>
    </Layout.FlexCol>
  );
}
