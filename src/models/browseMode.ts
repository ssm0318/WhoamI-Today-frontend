import { SocialBattery } from '@models/checkIn';

/** Built-in mode ids are stable strings; custom presets use numeric ids from the backend. */
export type BuiltInBrowseModeId = 'very_social' | 'selectively_social' | 'quiet';

export type BrowseModeTabKey =
  | 'friends'
  | 'update'
  | 'share'
  | 'discover'
  | 'chats'
  | 'my'
  | 'questions';

export type BrowseModeFilters = {
  /**
   * When true, the FriendsList close-friends-only checkbox starts checked.
   * Wired in `routes/friends/FriendsList.tsx`.
   */
  friends_close_only?: boolean;
  /**
   * When true, the ChatList close-friends-only filter starts on.
   * Wired in `routes/chat/ChatList.tsx`.
   */
  chats_close_only?: boolean;
};

export type BrowseModeSections = {
  /** Hide synthetic daily-digest-style cards from the friends feed (mission prompts, profile suggestions, etc.). */
  hide_synthetic_digest_cards?: boolean;
  /** Hide ping/poke buttons on friend cards. */
  hide_ping_buttons?: boolean;
  /** Hide the "New post" badges. */
  hide_new_post_badge?: boolean;
};

export type BrowseModeConfig = {
  tabs: BrowseModeTabKey[];
  filters: BrowseModeFilters;
  sections: BrowseModeSections;
  /**
   * Per-tab time limits (minutes). When a tab has a duration set, the
   * frontend's `useBrowseModeTabDurations` hook removes that tab from the
   * active mode N minutes after activation. Persists activation time in
   * localStorage so the timer survives reloads. Tabs missing from this map
   * are persistent — they stay until the user changes mode.
   *
   * This is how Digital-detox-style modes work: start with the broad set
   * of tabs, mark the scroll-y ones with a duration, and they'll fade out
   * automatically after the user's chosen window.
   */
  tab_durations?: Partial<Record<BrowseModeTabKey, number>>;
};

export type BuiltInBrowseMode = {
  kind: 'built_in';
  id: BuiltInBrowseModeId;
  emoji: string;
  /** i18n key suffix under `browse_mode.modes` (e.g., `very_social.name`, `very_social.description`). */
  i18nKey: BuiltInBrowseModeId;
  /** Battery level we suggest writing if the user keeps the sync toggle on. */
  suggestedBattery: SocialBattery;
  config: BrowseModeConfig;
};

export type CustomBrowseModePreset = {
  kind: 'custom';
  id: number;
  name: string;
  /**
   * Short user-written blurb shown under the preset name on picker cards.
   * Empty string = no description; the picker falls back to an auto-generated
   * tab-list summary in that case. Backend caps at 30 characters.
   */
  description: string;
  config: BrowseModeConfig;
  /** Battery level the sync toggle should apply when this preset activates. Null = no sync. */
  default_battery: SocialBattery | null;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Anything currently active in the session — built-in OR a custom preset. */
export type ActiveBrowseMode =
  | { kind: 'built_in'; id: BuiltInBrowseModeId; config: BrowseModeConfig }
  | {
      kind: 'custom';
      id: number;
      name: string;
      config: BrowseModeConfig;
      default_battery: SocialBattery | null;
    };

/** Server payload shape for create/update. */
export type BrowseModePresetPayload = {
  name: string;
  description?: string;
  config: BrowseModeConfig;
  default_battery?: SocialBattery | null;
};
