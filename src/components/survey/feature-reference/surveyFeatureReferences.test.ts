/* eslint-env jest */

import {
  getAllowedSurveyFeatureIds,
  getSurveyFeatureReference,
  parseSurveyFeatureText,
} from './surveyFeatureReferences';

describe('survey feature references', () => {
  it('links the current feature on its rating and follow-up pages with canonical casing', () => {
    const ratingSegments = parseSurveyFeatureText('**daily questions** — I liked this feature.', {
      surveySlug: 'feature_eval_w',
      questionSlug: 'goal1_feat_dailyq',
    });
    const followUpSegments = parseSurveyFeatureText(
      'What, if anything, did you enjoy most about the daily questions feature?',
      {
        surveySlug: 'feature_eval_w',
        questionSlug: 'goal1_feat_dailyq_enjoy',
      },
    );

    expect(ratingSegments).toEqual([
      { text: 'Daily Questions', featureId: 'goal1_feat_dailyq', bold: true },
      { text: ' — I liked this feature.', bold: false },
    ]);
    expect(followUpSegments).toContainEqual({
      text: 'Daily Questions',
      featureId: 'goal1_feat_dailyq',
      bold: false,
    });
  });

  it('does not link nested feature names when a specific feature page has a narrower target', () => {
    const segments = parseSurveyFeatureText(
      '**Structured posts** (mission of the day, photo of the day, question of the day) — I liked this feature.',
      {
        surveySlug: 'feature_eval_w',
        questionSlug: 'goal5_feat_posts',
      },
    );

    expect(segments.filter((segment) => segment.featureId)).toEqual([
      { text: 'Structured Posts', featureId: 'goal5_feat_posts', bold: true },
    ]);
    expect(segments.map((segment) => segment.text).join('')).toContain('mission of the day');
  });

  it('keeps same-feature descriptor aliases as plain text', () => {
    const segments = parseSurveyFeatureText(
      '**Profile decoration** (profile chips, pinned check-ins) — I liked this feature.',
      {
        surveySlug: 'feature_eval_w',
        questionSlug: 'goal7_feat_profile_decoration',
      },
    );

    expect(segments.map((segment) => segment.text).join('')).toBe(
      'Profile Decoration (Profile Chips, Pinned Check-Ins) — I liked this feature.',
    );
    expect(segments.filter((segment) => segment.featureId)).toEqual([
      { text: 'Profile Decoration', featureId: 'goal7_feat_profile_decoration', bold: true },
    ]);
  });

  it('shows separate profile decoration screenshots for chips and pinned check-ins', () => {
    expect(getSurveyFeatureReference('goal7_feat_profile_decoration').screenshots).toEqual([
      {
        src: '/survey-feature-screenshots/goal7_feat_profile_decoration-01.png',
        alt: 'Profile Decoration screenshot 1',
      },
      {
        src: '/survey-feature-screenshots/goal7_feat_profile_decoration-02.png',
        alt: 'Profile Decoration screenshot 2',
      },
    ]);
  });

  it('uses multiple screenshots for features that need separate visual references', () => {
    expect(getSurveyFeatureReference('goal3_feat_checkin_reactions').screenshots).toHaveLength(2);
    expect(getSurveyFeatureReference('goal4_feat_granular_sub').screenshots).toHaveLength(2);
    expect(getSurveyFeatureReference('goal7_feat_discover').screenshots).toHaveLength(3);
  });

  it('links multiple approved features in W version-orientation copy', () => {
    const segments = parseSurveyFeatureText(
      "That's the version with check-ins, missions, daily digest, profile decoration, and browsing modes.",
      {
        surveySlug: 'post_study_w',
        questionSlug: 'version_orientation',
      },
    );

    expect(segments.filter((segment) => segment.featureId)).toEqual([
      { text: 'Check-Ins', featureId: 'goal5_feat_checkins', bold: false },
      { text: 'Mission of the Day', featureId: 'goal6_feat_mission', bold: false },
      { text: 'Daily Digest', featureId: 'goal7_feat_discover', bold: false },
      { text: 'Profile Decoration', featureId: 'goal7_feat_profile_decoration', bold: false },
      { text: 'Browsing Modes', featureId: 'goal2_feat_browse', bold: false },
    ]);
  });

  it('does not globally link generic phrases outside approved survey contexts', () => {
    expect(
      getAllowedSurveyFeatureIds({
        surveySlug: 'daily_base',
        questionSlug: 'daily_question_prompt',
      }),
    ).toEqual([]);
    expect(
      parseSurveyFeatureText('Daily questions are useful, and check-ins are useful.', {
        surveySlug: 'daily_base',
        questionSlug: 'daily_question_prompt',
      }),
    ).toEqual([{ text: 'Daily questions are useful, and check-ins are useful.', bold: false }]);
  });
});
