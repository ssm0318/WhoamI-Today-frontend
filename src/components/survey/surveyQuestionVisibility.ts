import type { ConditionalDisplay, SurveyOptionValue, SurveyQuestion } from '../../models/survey';

import type { SurveyAnswerValue } from './surveyPageResume';

const DEPRECATED_FEATURE_NEVER_SHOWN_DEPENDENCY = '__deprecated_feature_never_shown__';

const evaluateCondition = (
  rule: ConditionalDisplay,
  controllerValue: SurveyAnswerValue,
): boolean => {
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

export const getVisibleSurveyQuestions = (
  allQuestions: SurveyQuestion[],
  answers: Record<number, SurveyAnswerValue>,
): SurveyQuestion[] => {
  const bySlug = new Map<string, SurveyQuestion>();
  allQuestions.forEach((q) => {
    if (q.slug) bySlug.set(q.slug, q);
  });

  return allQuestions.filter((q) => {
    if (!q.conditional_display) return true;
    const controller = bySlug.get(q.conditional_display.depends_on);
    if (!controller) {
      // Keep the historical fail-open behavior for ordinary author typos,
      // but support the migration sentinel used to retire old questions.
      return q.conditional_display.depends_on !== DEPRECATED_FEATURE_NEVER_SHOWN_DEPENDENCY;
    }
    return evaluateCondition(q.conditional_display, answers[controller.id]);
  });
};
