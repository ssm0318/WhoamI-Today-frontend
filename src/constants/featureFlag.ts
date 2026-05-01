import { VersionType } from '@models/api/user';

export enum FeatureFlagKey {
  /** 친구탭 페이지에서 친구 피드(친구들의 게시물을 최신순으로 노출)를 노출하는 플래그 (Ver. R) */
  FRIEND_FEED = 'friendFeed',
  /** 친구탭 페이지에서 전체 친구 목록을 노출하는 플래그 (Ver. Q) */
  FRIEND_LIST = 'friendList',
  /** 리액션 숫자 노출 플래그 */
  REACTION_COUNT = 'reactionCount',
  /** 체크인 (status) 플래그 */
  CHECK_IN = 'checkIn',
  /** 질문, 답변 관련 기능 태그 */
  QUESTION_RESPONSE_FEATURE = 'questionResponseFeature',
  /** 페르소나 칩 플래그 */
  PERSONA = 'persona',
  /** 게시글 작성시 기본 설정 친한 친구 타입 플래그 */
  POST_VISIBILITY_DEFAULT_CLOSE_FRIEND = 'postVisibilityDefaultCloseFriend',
  /** DISCOVER 탭 */
  DISCOVER = 'discover',
  /** Chat 탭 */
  CHAT_TAB = 'chatTab',
  /** version_q 전용 Friends (/friends-q) 탭 노출 */
  FRIEND_UPDATES_TAB = 'friendUpdatesTab',
  /** 하단 Questions 탭 노출 (QUESTION_RESPONSE_FEATURE 와 별개 — 전자는 탭 가시성, 후자는 피처 전반) */
  QUESTIONS_TAB = 'questionsTab',
  /** version_q 게시글 단순화: 비밀댓글/이모지 리액션 숨김, visibility close-only 단일 체크박스, update_past_posts 항상 true */
  POSTS_VER_Q = 'postsVerQ',
  /** version_q 신규 image+text 체크인 + stories 가로 스크롤 */
  CHECK_IN_POSTS = 'checkInPosts',
  /** 하단 nav 에 My 탭 노출 (version_q 전용) */
  MY_TAB_VISIBLE = 'myTabVisible',
  /** 하단 nav 에 Share 탭 노출 + version_q 용 placeholder */
  SHARE_TAB_VISIBLE = 'shareTabVisible',
  /** 종 아이콘을 multi-checkbox 구독 popup 으로 (양 버전 공통) */
  SUBSCRIPTION_POPUP = 'subscriptionPopup',
  /** 채팅 목록에서 Close Friends Only 필터 토글 노출 */
  CHAT_CLOSE_FRIENDS_FILTER = 'chatCloseFriendsFilter',
  /** 세션 시작 시 social battery + browse mode 프롬프트 (Ver. W 전용) */
  BROWSE_MODE = 'browseMode',
}

export type FeatureFlagMap = { [feature in FeatureFlagKey]: boolean };
export type FeatureFlagMapCollection = {
  [version in VersionType]: FeatureFlagMap;
};

// Default (Ver. R)
const DEFAULT_FLAGS = {
  [FeatureFlagKey.FRIEND_FEED]: true,
  [FeatureFlagKey.FRIEND_LIST]: false,
  [FeatureFlagKey.REACTION_COUNT]: true,
  [FeatureFlagKey.CHECK_IN]: false,
  [FeatureFlagKey.QUESTION_RESPONSE_FEATURE]: false,
  [FeatureFlagKey.PERSONA]: false,
  [FeatureFlagKey.POST_VISIBILITY_DEFAULT_CLOSE_FRIEND]: false,
  [FeatureFlagKey.DISCOVER]: false,
  [FeatureFlagKey.CHAT_TAB]: false,
  [FeatureFlagKey.FRIEND_UPDATES_TAB]: false,
  [FeatureFlagKey.QUESTIONS_TAB]: false,
  [FeatureFlagKey.POSTS_VER_Q]: false,
  [FeatureFlagKey.CHECK_IN_POSTS]: false,
  [FeatureFlagKey.MY_TAB_VISIBLE]: false,
  [FeatureFlagKey.SHARE_TAB_VISIBLE]: false,
  [FeatureFlagKey.SUBSCRIPTION_POPUP]: false,
  [FeatureFlagKey.CHAT_CLOSE_FRIENDS_FILTER]: false,
  [FeatureFlagKey.BROWSE_MODE]: false,
};

export const FEATURE_FLAG_MAP_COLLECTION: FeatureFlagMapCollection = {
  // Ver. Q
  [VersionType.VER_Q]: {
    ...DEFAULT_FLAGS,
    [FeatureFlagKey.FRIEND_FEED]: false,
    [FeatureFlagKey.CHAT_TAB]: true,
    [FeatureFlagKey.QUESTION_RESPONSE_FEATURE]: true,
    [FeatureFlagKey.DISCOVER]: true,
    [FeatureFlagKey.POSTS_VER_Q]: true,
    [FeatureFlagKey.CHECK_IN_POSTS]: true,
    [FeatureFlagKey.MY_TAB_VISIBLE]: true,
    [FeatureFlagKey.SHARE_TAB_VISIBLE]: true,
    [FeatureFlagKey.SUBSCRIPTION_POPUP]: true,
    [FeatureFlagKey.POST_VISIBILITY_DEFAULT_CLOSE_FRIEND]: true,
    [FeatureFlagKey.CHAT_CLOSE_FRIENDS_FILTER]: false,
  },
  // Ver. W
  [VersionType.VER_W]: {
    ...DEFAULT_FLAGS,
    [FeatureFlagKey.FRIEND_FEED]: false,
    [FeatureFlagKey.FRIEND_LIST]: true,
    [FeatureFlagKey.REACTION_COUNT]: false,
    [FeatureFlagKey.CHECK_IN]: true,
    [FeatureFlagKey.QUESTION_RESPONSE_FEATURE]: true,
    [FeatureFlagKey.PERSONA]: true,
    [FeatureFlagKey.POST_VISIBILITY_DEFAULT_CLOSE_FRIEND]: true,
    [FeatureFlagKey.DISCOVER]: true,
    [FeatureFlagKey.SHARE_TAB_VISIBLE]: true,
    [FeatureFlagKey.CHAT_TAB]: true,
    [FeatureFlagKey.SUBSCRIPTION_POPUP]: true,
    [FeatureFlagKey.CHAT_CLOSE_FRIENDS_FILTER]: true,
    [FeatureFlagKey.BROWSE_MODE]: true,
  },
};
