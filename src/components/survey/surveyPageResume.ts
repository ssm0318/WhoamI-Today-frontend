import type {
  DraftAnswers,
  DraftAnswerValue,
  PerFriendAnswerMap,
} from '../../hooks/useSurveyDraft';
import { PER_FRIEND_QUESTION_TYPES, type SurveyQuestion } from '../../models/survey';

export type SurveyAnswerValue = DraftAnswerValue | undefined;

export type SurveyPage =
  | { kind: 'single'; question: SurveyQuestion }
  | { kind: 'per_friend_block'; questions: SurveyQuestion[] }
  | { kind: 'feature_block'; questions: SurveyQuestion[] };

export const isDisplayOnly = (q: SurveyQuestion) => q.type === 'display_only';

const isFeatureRatingQuestion = (q: SurveyQuestion) =>
  /^goal\d+_feat_/.test(q.slug) && !q.slug.endsWith('_enjoy') && !q.slug.endsWith('_dislike');

export function groupQuestionsIntoPages(questions: SurveyQuestion[]): SurveyPage[] {
  const pages: SurveyPage[] = [];
  let buffer: SurveyQuestion[] = [];
  const flush = () => {
    if (buffer.length > 0) {
      pages.push({ kind: 'per_friend_block', questions: buffer });
      buffer = [];
    }
  };
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    if (PER_FRIEND_QUESTION_TYPES.has(q.type)) {
      buffer.push(q);
    } else {
      flush();
      let groupedFeatureBlock = false;
      if (isFeatureRatingQuestion(q)) {
        const enjoy = questions[i + 1];
        const dislike = questions[i + 2];
        if (enjoy?.slug === `${q.slug}_enjoy` && dislike?.slug === `${q.slug}_dislike`) {
          pages.push({ kind: 'feature_block', questions: [q, enjoy, dislike] });
          i += 2;
          groupedFeatureBlock = true;
        }
      }
      if (!groupedFeatureBlock) {
        pages.push({ kind: 'single', question: q });
      }
    }
  }
  flush();
  return pages;
}

// `null` is a meaningful answer on likert_5_na (the NA_SENTINEL — a
// recorded "not applicable" pick). `undefined` means the user hasn't
// engaged with the question yet.
export const hasValue = (value: SurveyAnswerValue): boolean => {
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const isPerFriendAnswerMapValue = (value: SurveyAnswerValue): value is PerFriendAnswerMap =>
  value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);

const isQuestionAnswered = (question: SurveyQuestion, value: SurveyAnswerValue) => {
  if (isDisplayOnly(question)) return true;
  if (!question.required) return true;
  return hasValue(value);
};

type FriendGroup = {
  friendId: number;
  baselineCloseness: number | null;
  questions: SurveyQuestion[];
};

const groupByFriend = (questions: SurveyQuestion[]): FriendGroup[] => {
  const groups: FriendGroup[] = [];
  const indexById = new Map<number, number>();
  questions.forEach((q) => {
    const tid = q.target_user_id;
    if (tid == null) return;
    let idx = indexById.get(tid);
    if (idx === undefined) {
      idx = groups.length;
      indexById.set(tid, idx);
      groups.push({
        friendId: tid,
        baselineCloseness: q.baseline_closeness ?? null,
        questions: [],
      });
    }
    groups[idx].questions.push(q);
  });
  return groups;
};

const isFriendQuestionAnswered = (
  q: SurveyQuestion,
  group: FriendGroup,
  answers: DraftAnswers,
): boolean => {
  if (!q.required) return true;
  const hasBaseline = group.baselineCloseness !== null;
  if (q.slug.endsWith('_corrected_baseline') && !hasBaseline) return true;
  const cell = answers[q.id];
  if (!isPerFriendAnswerMapValue(cell)) return false;
  return hasValue(cell[String(group.friendId)]);
};

const isPerFriendBlockComplete = (questions: SurveyQuestion[], answers: DraftAnswers): boolean => {
  const friendGroups = groupByFriend(questions);
  return friendGroups.every((g) =>
    g.questions.every((q) => isFriendQuestionAnswered(q, g, answers)),
  );
};

export const isSurveyPageAnswered = (page: SurveyPage, answers: DraftAnswers): boolean => {
  if (page.kind === 'single') return isQuestionAnswered(page.question, answers[page.question.id]);
  if (page.kind === 'feature_block') {
    return page.questions.every((q) => isQuestionAnswered(q, answers[q.id]));
  }
  return isPerFriendBlockComplete(page.questions, answers);
};

const hasSavedAnswer = (question: SurveyQuestion, value: SurveyAnswerValue): boolean => {
  if (isDisplayOnly(question)) return false;
  if (PER_FRIEND_QUESTION_TYPES.has(question.type)) {
    if (!isPerFriendAnswerMapValue(value)) return false;
    return Object.values(value).some(hasValue);
  }
  return hasValue(value);
};

const isDisplayOnlyPage = (page: SurveyPage): boolean =>
  page.kind === 'single' && isDisplayOnly(page.question);

const includeAttachedDisplayOnlyPages = (pages: SurveyPage[], index: number): number => {
  let nextIndex = index;
  while (nextIndex > 0 && isDisplayOnlyPage(pages[nextIndex - 1])) {
    nextIndex -= 1;
  }
  return nextIndex;
};

export function getInitialSurveyPageIndex(questions: SurveyQuestion[], answers: DraftAnswers) {
  const pages = groupQuestionsIntoPages(questions);
  if (pages.length === 0) return 0;

  const hasAnySavedAnswer = questions.some((q) => hasSavedAnswer(q, answers[q.id]));
  if (!hasAnySavedAnswer) return 0;

  const firstUnanswered = pages.findIndex((p) => !isSurveyPageAnswered(p, answers));
  const targetIndex = firstUnanswered === -1 ? pages.length - 1 : firstUnanswered;
  return includeAttachedDisplayOnlyPages(pages, targetIndex);
}
