export type SurveyFeatureId =
  | 'goal1_feat_dailyq'
  | 'goal1_feat_qsend'
  | 'goal2_feat_browse'
  | 'goal2_feat_social_battery_level'
  | 'goal3_feat_checkin_reactions'
  | 'goal3_feat_emoji'
  | 'goal3_feat_private'
  | 'goal3_feat_profile_list'
  | 'goal3_feat_ping'
  | 'goal4_feat_close_filter'
  | 'goal4_feat_granular_sub'
  | 'goal5_feat_posts'
  | 'goal5_feat_checkins'
  | 'goal6_feat_playlist'
  | 'goal6_feat_widget'
  | 'goal6_feat_survey_digest'
  | 'goal6_feat_mission'
  | 'goal7_feat_discover'
  | 'goal7_feat_nth_degree'
  | 'goal7_feat_profile_decoration'
  | 'goal7_feat_scrollable_discover'
  | 'goal8_feat_nonpublic'
  | 'goal8_feat_view_as'
  | 'goal8_feat_retroactive';

export interface SurveyFeatureScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface SurveyFeatureReference {
  id: SurveyFeatureId;
  canonicalName: string;
  aliases: string[];
  screenshots: SurveyFeatureScreenshot[];
}

export interface SurveyFeatureTextContext {
  surveySlug: string;
  questionSlug: string;
}

export interface SurveyFeatureTextSegment {
  text: string;
  bold: boolean;
  featureId?: SurveyFeatureId;
}

const screenshot = (
  featureId: SurveyFeatureId,
  canonicalName: string,
  count = 1,
): SurveyFeatureScreenshot[] =>
  Array.from({ length: count }, (_, idx) => {
    const suffix = String(idx + 1).padStart(2, '0');
    return {
      src: `/survey-feature-screenshots/${featureId}-${suffix}.png`,
      alt: count === 1 ? `${canonicalName} screenshot` : `${canonicalName} screenshot ${idx + 1}`,
    };
  });

const feature = (
  id: SurveyFeatureId,
  canonicalName: string,
  aliases: string[],
  screenshotCount = 1,
): SurveyFeatureReference => ({
  id,
  canonicalName,
  aliases: [canonicalName, ...aliases],
  screenshots: screenshot(id, canonicalName, screenshotCount),
});

export const SURVEY_FEATURE_REFERENCES: Record<SurveyFeatureId, SurveyFeatureReference> = {
  goal1_feat_dailyq: feature('goal1_feat_dailyq', 'Daily Questions', [
    'daily questions',
    'daily question',
  ]),
  goal1_feat_qsend: feature('goal1_feat_qsend', 'Question Sending', [
    'question sending',
    'sending questions to specific friends',
    'sending a question',
  ]),
  goal2_feat_browse: feature('goal2_feat_browse', 'Browsing Modes', [
    'browsing modes',
    'quiet vs. social mode',
    'quiet mode',
    'social mode',
  ]),
  goal2_feat_social_battery_level: feature(
    'goal2_feat_social_battery_level',
    'Social Battery Level',
    ['social battery level', 'social battery'],
  ),
  goal3_feat_checkin_reactions: feature(
    'goal3_feat_checkin_reactions',
    'Check-In Reactions',
    ['check-in reactions', 'check in reactions'],
    2,
  ),
  goal3_feat_emoji: feature('goal3_feat_emoji', 'Emoji Reactions', [
    'emoji reactions',
    'emoji reaction',
  ]),
  goal3_feat_private: feature('goal3_feat_private', 'Private Comments', [
    'private comments',
    'private comment',
  ]),
  goal3_feat_profile_list: feature('goal3_feat_profile_list', 'Profile-List Feed', [
    'profile-list feed',
    'profile list feed',
  ]),
  goal3_feat_ping: feature('goal3_feat_ping', 'Ping for Check-In', [
    'ping for check-in',
    'ping for check in',
  ]),
  goal4_feat_close_filter: feature('goal4_feat_close_filter', 'Close-Friend Filter', [
    'close-friend filter',
    'close friend filter',
  ]),
  goal4_feat_granular_sub: feature(
    'goal4_feat_granular_sub',
    'Granular Subscription to Friends',
    ['granular subscription to friends', 'granular subscription'],
    2,
  ),
  goal5_feat_posts: feature('goal5_feat_posts', 'Structured Posts', ['structured posts']),
  goal5_feat_checkins: feature('goal5_feat_checkins', 'Check-Ins', ['check-ins', 'checkins']),
  goal6_feat_playlist: feature('goal6_feat_playlist', 'Shared Playlist', ['shared playlist']),
  goal6_feat_widget: feature('goal6_feat_widget', 'Widget', ['widget', 'home-screen widget']),
  goal6_feat_survey_digest: feature(
    'goal6_feat_survey_digest',
    'Survey of the Day',
    ['survey of the day', 'daily survey question'],
    2,
  ),
  goal6_feat_mission: feature('goal6_feat_mission', 'Mission of the Day', [
    'mission of the day',
    'missions',
    'mission',
  ]),
  goal7_feat_discover: feature(
    'goal7_feat_discover',
    'Daily Digest',
    ['daily digest', 'digest tab'],
    3,
  ),
  goal7_feat_nth_degree: feature(
    'goal7_feat_nth_degree',
    'Nth-Degree Connections + Mutual Interests on Profiles',
    [
      'nth-degree connections + mutual interests on profiles',
      'nth-degree connections',
      'mutual interests on profiles',
    ],
    2,
  ),
  goal7_feat_profile_decoration: feature(
    'goal7_feat_profile_decoration',
    'Profile Decoration',
    ['profile decoration', 'profile chips', 'pinned check-ins'],
    2,
  ),
  goal7_feat_scrollable_discover: feature(
    'goal7_feat_scrollable_discover',
    'Scrollable Discover Feed',
    ['scrollable discover feed', 'scrollable discover'],
  ),
  goal8_feat_nonpublic: feature(
    'goal8_feat_nonpublic',
    'Non-Public Account with Selective Public Sharing',
    [
      'non-public account with selective public sharing',
      'non public account with selective public sharing',
      'non-public account',
      'selective public sharing',
    ],
  ),
  goal8_feat_view_as: feature('goal8_feat_view_as', 'View As', ['view as'], 3),
  goal8_feat_retroactive: feature('goal8_feat_retroactive', 'Apply Privacy Changes to Past Posts', [
    'apply privacy changes to past posts',
    'applying privacy changes to past posts',
    'privacy changes to past posts',
  ]),
};

const W_FEATURE_IDS: SurveyFeatureId[] = [
  'goal1_feat_dailyq',
  'goal1_feat_qsend',
  'goal2_feat_browse',
  'goal2_feat_social_battery_level',
  'goal3_feat_checkin_reactions',
  'goal3_feat_emoji',
  'goal3_feat_private',
  'goal3_feat_profile_list',
  'goal3_feat_ping',
  'goal4_feat_close_filter',
  'goal4_feat_granular_sub',
  'goal5_feat_posts',
  'goal5_feat_checkins',
  'goal6_feat_playlist',
  'goal6_feat_widget',
  'goal6_feat_survey_digest',
  'goal6_feat_mission',
  'goal7_feat_discover',
  'goal7_feat_nth_degree',
  'goal7_feat_profile_decoration',
  'goal8_feat_nonpublic',
  'goal8_feat_view_as',
  'goal8_feat_retroactive',
];

const Q_FEATURE_IDS: SurveyFeatureId[] = [
  'goal1_feat_dailyq',
  'goal1_feat_qsend',
  'goal7_feat_scrollable_discover',
];

const W_VERSION_SURVEYS = new Set(['mid_study_w', 'post_study_w', 'feature_eval_w']);
const Q_VERSION_SURVEYS = new Set(['mid_study_q', 'post_study_q']);

export const normalizeFeatureQuestionSlug = (questionSlug: string): string =>
  questionSlug.replace(/_(enjoy|dislike)$/, '');

export const getAllowedSurveyFeatureIds = ({
  surveySlug,
  questionSlug,
}: SurveyFeatureTextContext): SurveyFeatureId[] => {
  const baseSlug = normalizeFeatureQuestionSlug(questionSlug);
  if (baseSlug in SURVEY_FEATURE_REFERENCES) return [baseSlug as SurveyFeatureId];

  if (questionSlug === 'version_orientation') {
    if (W_VERSION_SURVEYS.has(surveySlug)) return W_FEATURE_IDS;
    if (Q_VERSION_SURVEYS.has(surveySlug)) return Q_FEATURE_IDS;
  }

  if (surveySlug === 'feature_eval_w' && questionSlug === 'feature_eval_intro') {
    return W_FEATURE_IDS;
  }

  return [];
};

interface BoldChunk {
  text: string;
  bold: boolean;
}

interface AliasCandidate {
  feature: SurveyFeatureReference;
  alias: string;
  lowerAlias: string;
}

const splitBoldChunks = (text: string): BoldChunk[] => {
  const chunks: BoldChunk[] = [];
  let bold = false;
  let cursor = 0;

  while (cursor < text.length) {
    const marker = text.indexOf('**', cursor);
    if (marker === -1) {
      if (cursor < text.length) chunks.push({ text: text.slice(cursor), bold });
      break;
    }
    if (marker > cursor) chunks.push({ text: text.slice(cursor, marker), bold });
    bold = !bold;
    cursor = marker + 2;
  }

  return chunks.filter((chunk) => chunk.text.length > 0);
};

const isBoundary = (value: string | undefined): boolean =>
  value === undefined || !/[A-Za-z0-9]/.test(value);

const getAliasCandidates = (featureIds: SurveyFeatureId[]): AliasCandidate[] =>
  featureIds
    .flatMap((id) => {
      const featureRef = SURVEY_FEATURE_REFERENCES[id];
      const uniqueAliases = Array.from(new Set(featureRef.aliases.filter(Boolean)));
      return uniqueAliases.map((alias) => ({
        feature: featureRef,
        alias,
        lowerAlias: alias.toLowerCase(),
      }));
    })
    .sort((a, b) => b.lowerAlias.length - a.lowerAlias.length);

const titleCaseAlias = (value: string): string =>
  value.replace(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g, (word) =>
    word
      .split('-')
      .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part))
      .join('-'),
  );

const parseChunk = (
  chunk: BoldChunk,
  candidates: AliasCandidate[],
  preserveSameFeatureAliases: boolean,
): SurveyFeatureTextSegment[] => {
  if (candidates.length === 0) return [chunk];

  const segments: SurveyFeatureTextSegment[] = [];
  const lower = chunk.text.toLowerCase();
  let cursor = 0;

  while (cursor < chunk.text.length) {
    let match: AliasCandidate | null = null;
    for (let idx = 0; idx < candidates.length; idx += 1) {
      const candidate = candidates[idx];
      if (
        lower.startsWith(candidate.lowerAlias, cursor) &&
        isBoundary(chunk.text[cursor - 1]) &&
        isBoundary(chunk.text[cursor + candidate.alias.length])
      ) {
        match = candidate;
        break;
      }
    }

    if (match) {
      const matchedText = chunk.text.slice(cursor, cursor + match.alias.length);
      const isCanonicalAlias = match.lowerAlias === match.feature.canonicalName.toLowerCase();
      const shouldPreserveTextOnly = preserveSameFeatureAliases && !isCanonicalAlias;
      segments.push({
        text: shouldPreserveTextOnly ? titleCaseAlias(matchedText) : match.feature.canonicalName,
        featureId: shouldPreserveTextOnly ? undefined : match.feature.id,
        bold: chunk.bold,
      });
      cursor += match.alias.length;
    } else {
      const last = segments[segments.length - 1];
      if (last && !last.featureId && last.bold === chunk.bold) {
        last.text += chunk.text[cursor];
      } else {
        segments.push({ text: chunk.text[cursor], bold: chunk.bold });
      }
      cursor += 1;
    }
  }

  return segments;
};

export const parseSurveyFeatureText = (
  text: string,
  context: SurveyFeatureTextContext,
): SurveyFeatureTextSegment[] => {
  const allowedFeatureIds = getAllowedSurveyFeatureIds(context);
  const baseSlug = normalizeFeatureQuestionSlug(context.questionSlug);
  const preserveSameFeatureAliases =
    allowedFeatureIds.length === 1 && allowedFeatureIds[0] === baseSlug;
  const candidates = getAliasCandidates(allowedFeatureIds);
  return splitBoldChunks(text).flatMap((chunk) =>
    parseChunk(chunk, candidates, preserveSameFeatureAliases),
  );
};

export const getSurveyFeatureReference = (featureId: SurveyFeatureId): SurveyFeatureReference =>
  SURVEY_FEATURE_REFERENCES[featureId];
