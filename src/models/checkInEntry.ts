import { ComponentVisibility, SocialBattery } from './checkIn';

export enum ComponentType {
  BATTERY = 'battery',
  MOOD = 'mood',
  THOUGHT = 'thought',
  SONG = 'song',
}

/** Per-component payload stored in CheckInComponentEntry.data on the backend. */
export type EntryData =
  | { social_battery: SocialBattery }
  | { mood: string[] }
  | { thought: string }
  | {
      track_id: string;
      title?: string | null;
      artist?: string | null;
      album_cover_url?: string | null;
    };

export interface CheckInComponentEntry {
  id: number;
  component: ComponentType;
  data: EntryData;
  visibility: ComponentVisibility;
  is_pinned: boolean;
  pin_visibility: ComponentVisibility | null;
  created_at: string;
  superseded_at: string | null;
}

/** Extra fields the archive + friend-pinned endpoints add alongside the paginated results. */
export interface ArchiveCounts {
  /** Total pinned archived rows (friend view: only pins visible to the viewer). */
  pinned_count: number;
  /** Only populated by the owner archive endpoint. */
  archived_count?: number;
}

export type ArchiveTab = 'all' | 'pinned';
