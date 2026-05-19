import type { SurveyOptionValue, SurveyQuestion } from '../../../models/survey';

export const isBaselineCorrectionQuestion = (question: SurveyQuestion): boolean =>
  question.slug.endsWith('_corrected_baseline');

export const shouldShowBaselineCorrectionInput = ({
  question,
  hasBaseline,
  correctionRequested,
  existingValue,
}: {
  question: SurveyQuestion;
  hasBaseline: boolean;
  correctionRequested: boolean;
  existingValue: SurveyOptionValue | null | undefined;
}): boolean => {
  if (!isBaselineCorrectionQuestion(question)) return true;
  if (!hasBaseline) return true;
  return correctionRequested || existingValue !== undefined;
};
