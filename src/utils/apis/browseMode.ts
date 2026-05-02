import { PaginationResponse } from '@models/api/common';
import { BrowseModePresetPayload, CustomBrowseModePreset } from '@models/browseMode';
import axios from './axios';

type ServerPreset = Omit<CustomBrowseModePreset, 'kind'>;

const fromServer = (p: ServerPreset): CustomBrowseModePreset => ({ kind: 'custom', ...p });

export const getBrowseModePresets = async (): Promise<CustomBrowseModePreset[]> => {
  const { data } = await axios.get<PaginationResponse<ServerPreset[]> | ServerPreset[]>(
    `/browse_mode/presets/`,
  );
  // The backend uses DRF pagination ({ results: [...] }) but flat-array fallbacks exist elsewhere.
  if (Array.isArray(data)) return data.map(fromServer);
  const pag = data as PaginationResponse<ServerPreset[]> | undefined;
  if (pag?.results && Array.isArray(pag.results)) return pag.results.map(fromServer);
  return [];
};

export const createBrowseModePreset = async (
  payload: BrowseModePresetPayload,
): Promise<CustomBrowseModePreset> => {
  const { data } = await axios.post<ServerPreset>(`/browse_mode/presets/`, payload);
  return fromServer(data);
};

export const updateBrowseModePreset = async (
  id: number,
  payload: Partial<BrowseModePresetPayload>,
): Promise<CustomBrowseModePreset> => {
  const { data } = await axios.patch<ServerPreset>(`/browse_mode/presets/${id}/`, payload);
  return fromServer(data);
};

export const deleteBrowseModePreset = async (id: number): Promise<void> => {
  await axios.delete(`/browse_mode/presets/${id}/`);
};

export const markBrowseModePresetUsed = async (id: number): Promise<CustomBrowseModePreset> => {
  const { data } = await axios.post<ServerPreset>(`/browse_mode/presets/${id}/used/`);
  return fromServer(data);
};

/**
 * Submit a free-text feature request from the customize sheet — "what other
 * granular changes would you like?". Write-only; users never read each others'.
 */
export const submitBrowseModeWishlist = async (content: string): Promise<void> => {
  await axios.post(`/browse_mode/wishlist/`, { content });
};

export type BrowseModePickEventPayload =
  | { kind: 'built_in'; built_in_id: 'very_social' | 'selectively_social' | 'quiet' }
  | { kind: 'custom'; preset_id: number }
  | { kind: 'apply_without_saving' };

/**
 * Append-only pick log. Fired every time the user actively activates a mode
 * (built-in / custom / apply-without-saving). Skips and dismisses are NOT
 * logged. Used by analytics to count picks, switches, and distinct types.
 *
 * Best-effort — callers should not block UI on this; failures are silent.
 */
export const logBrowseModePick = async (payload: BrowseModePickEventPayload): Promise<void> => {
  try {
    await axios.post(`/browse_mode/picks/`, payload);
  } catch {
    /* analytics is best-effort */
  }
};
