import { BrowseModeTabKey, BuiltInBrowseMode, BuiltInBrowseModeId } from '@models/browseMode';
import { SocialBattery } from '@models/checkIn';

/**
 * Tab keys the user can toggle in the customize sheet — limited to the bottom-tab
 * tabs they actually see on Ver. W. `my` (profile) lives in the hamburger menu and
 * `questions` is feature-flag-gated, so neither needs a per-mode toggle.
 *
 * The wider {@link BrowseModeTabKey} union still includes those keys so we don't
 * break any built-in modes referencing them.
 */
export const ALL_BROWSE_MODE_TABS: BrowseModeTabKey[] = [
  'friends',
  'update',
  'share',
  'discover',
  'chats',
];

export const BUILT_IN_BROWSE_MODES: Record<BuiltInBrowseModeId, BuiltInBrowseMode> = {
  very_social: {
    kind: 'built_in',
    id: 'very_social',
    i18nKey: 'very_social',
    emoji: '🤩',
    suggestedBattery: SocialBattery.fully_charged,
    config: {
      tabs: ['friends', 'update', 'share', 'discover', 'chats'],
      filters: {},
      sections: {},
    },
  },
  selectively_social: {
    kind: 'built_in',
    id: 'selectively_social',
    i18nKey: 'selectively_social',
    emoji: '💜',
    suggestedBattery: SocialBattery.moderately_social,
    config: {
      tabs: ['friends', 'update', 'share', 'chats'],
      filters: { friends_close_only: true },
      sections: { hide_synthetic_discover_cards: true },
    },
  },
  quiet: {
    kind: 'built_in',
    id: 'quiet',
    i18nKey: 'quiet',
    emoji: '🌙',
    suggestedBattery: SocialBattery.low,
    config: {
      tabs: ['share'],
      filters: {},
      sections: { hide_ping_buttons: true, hide_new_post_badge: true },
    },
  },
};

export const BUILT_IN_BROWSE_MODE_LIST: BuiltInBrowseMode[] = [
  BUILT_IN_BROWSE_MODES.very_social,
  BUILT_IN_BROWSE_MODES.selectively_social,
  BUILT_IN_BROWSE_MODES.quiet,
];

/**
 * Quick-start templates surfaced inside the customize sheet. Tapping one
 * prefills the form so users can save it (with their own name) instead of
 * starting from a blank slate. Distinct from the 3 built-in modes — these
 * are starting points for the user's OWN saved presets.
 */
export type CustomizeTemplate = {
  id: string;
  /** i18n key under `browse_mode.templates` */
  i18nKey: string;
  emoji: string;
  config: {
    tabs: BrowseModeTabKey[];
    filters: NonNullable<BuiltInBrowseMode['config']['filters']>;
    /** Per-tab fade-out timers — see BrowseModeConfig.tab_durations. */
    tab_durations?: Partial<Record<BrowseModeTabKey, number>>;
  };
};

/**
 * Default "fade-out" duration in minutes for tabs marked transient by the
 * Digital detox template. Editable per-tab in the customize sheet.
 */
export const DIGITAL_DETOX_DEFAULT_MINUTES = 15;

/**
 * Duration options surfaced next to each active tab in the customize sheet
 * (à la Apple's Focus-mode time pickers). `undefined` value = persistent
 * (no timer); numeric values are minutes.
 */
export const TAB_DURATION_OPTIONS: { value: number | undefined; i18nKey: string }[] = [
  { value: undefined, i18nKey: 'always' },
  { value: 5, i18nKey: 'minutes_5' },
  { value: 15, i18nKey: 'minutes_15' },
  { value: 30, i18nKey: 'minutes_30' },
  { value: 60, i18nKey: 'minutes_60' },
];

export const CUSTOMIZE_TEMPLATES: CustomizeTemplate[] = [
  {
    id: 'no_discover',
    i18nKey: 'no_discover',
    emoji: '👯',
    config: {
      tabs: ['friends', 'update', 'share', 'chats'],
      filters: {},
    },
  },
  {
    id: 'just_chat',
    i18nKey: 'just_chat',
    emoji: '💬',
    config: {
      tabs: ['chats'],
      filters: {},
    },
  },
  {
    id: 'just_discover',
    i18nKey: 'just_discover',
    emoji: '🔭',
    config: {
      tabs: ['discover'],
      filters: {},
    },
  },
  {
    // Time-based fade-out: surfaces ALL tabs initially so the user can wrap
    // up whatever they were doing, but every scroll-y / chat tab gets a
    // 15-minute timer. Share has no duration so it persists — once the
    // timers fire, all that's left is the post-something surface, which
    // is the spirit of detox. Editable per-tab in the customize sheet.
    id: 'digital_detox',
    i18nKey: 'digital_detox',
    emoji: '🌿',
    config: {
      tabs: ['friends', 'update', 'share', 'discover', 'chats'],
      filters: {},
      tab_durations: {
        friends: DIGITAL_DETOX_DEFAULT_MINUTES,
        update: DIGITAL_DETOX_DEFAULT_MINUTES,
        discover: DIGITAL_DETOX_DEFAULT_MINUTES,
        chats: DIGITAL_DETOX_DEFAULT_MINUTES,
      },
    },
  },
];
