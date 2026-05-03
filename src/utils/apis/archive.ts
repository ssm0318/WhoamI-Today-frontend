import { PaginationResponse } from '@models/api/common';
import { ComponentVisibility } from '@models/checkIn';
import { ArchiveCounts, CheckInComponentEntry } from '@models/checkInEntry';
import axios from './axios';

export type ArchiveEntriesResponse = PaginationResponse<CheckInComponentEntry[]> & ArchiveCounts;

/**
 * Normalize any archive endpoint URL into an axios-compatible path.
 *
 * First-page keys arrive as relative paths (`/check_in/entries/?tab=all`).
 * Cursor-paginated follow-ups arrive as absolute URLs produced by DRF
 * CursorPagination (`http://host/api/check_in/entries/?cursor=...`). The
 * existing axios instance is mounted at `/api/` so we strip that prefix.
 */
const toAxiosPath = (key: string): string => {
  if (!key.startsWith('http')) return key;
  const url = new URL(key);
  return url.pathname.replace(/^\/api/, '') + url.search;
};

/** Shared cursor fetcher for both archive + friend-pinned feeds. */
export const archiveEntriesFetcher = async (key: string): Promise<ArchiveEntriesResponse> => {
  const { data } = await axios.get<ArchiveEntriesResponse>(toAxiosPath(key));
  return data;
};

/** Owner archive feed — all archived entries or pinned-only, cursor paginated. */
export const getArchiveEntries = async (
  cursor?: string,
  tab: 'all' | 'pinned' = 'all',
): Promise<ArchiveEntriesResponse> => {
  const params = new URLSearchParams();
  if (tab !== 'all') params.set('tab', tab);
  if (cursor) params.set('cursor', cursor);
  const query = params.toString();
  const { data } = await axios.get<ArchiveEntriesResponse>(
    `/check_in/entries/${query ? `?${query}` : ''}`,
  );
  return data;
};

/** Friend-visible pinned entries for a specific user. */
export const getUserPinnedEntries = async (
  username: string,
  cursor?: string,
): Promise<ArchiveEntriesResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  const query = params.toString();
  const { data } = await axios.get<ArchiveEntriesResponse>(
    `/user/${username}/check_in/pinned/${query ? `?${query}` : ''}`,
  );
  return data;
};

/** PATCH toggle pin — accepts optional pin_visibility when pinning. */
export const togglePin = async (
  entryId: number,
  pinVisibility?: ComponentVisibility,
): Promise<CheckInComponentEntry> => {
  const { data } = await axios.patch<CheckInComponentEntry>(
    `/check_in/entries/${entryId}/pin/`,
    pinVisibility ? { pin_visibility: pinVisibility } : undefined,
  );
  return data;
};

/** PATCH update pin_visibility (only allowed when already pinned). */
export const updatePinVisibility = async (
  entryId: number,
  visibility: ComponentVisibility,
): Promise<CheckInComponentEntry> => {
  const { data } = await axios.patch<CheckInComponentEntry>(
    `/check_in/entries/${entryId}/pin_visibility/`,
    { pin_visibility: visibility },
  );
  return data;
};

/** DELETE soft-delete a history entry. */
export const deleteArchiveEntry = async (entryId: number): Promise<void> => {
  await axios.delete(`/check_in/entries/${entryId}/`);
};
