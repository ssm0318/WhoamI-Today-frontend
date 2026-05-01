import { BUILT_IN_BROWSE_MODES } from '@constants/browseMode';
import {
  ActiveBrowseMode,
  BrowseModeConfig,
  BuiltInBrowseModeId,
  CustomBrowseModePreset,
} from '@models/browseMode';
import { SocialBattery } from '@models/checkIn';
import {
  createBrowseModePreset,
  deleteBrowseModePreset,
  getBrowseModePresets,
  markBrowseModePresetUsed,
  updateBrowseModePreset,
} from '@utils/apis/browseMode';
import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface BrowseModeState {
  /** Currently-active browse mode for this session. Null = no mode selected (show everything). */
  activeBrowseMode: ActiveBrowseMode | null;
  /** User's saved custom presets, fetched from the backend. */
  customBrowseModePresets: CustomBrowseModePreset[];
  /** True while the initial fetch is in flight (and we haven't seen a response yet). */
  customBrowseModePresetsLoading: boolean;
  /**
   * True when something (typically the SideMenu's "Browsing Mode" item)
   * has requested the manual picker. Distinct from the auto-prompt at
   * session start, which uses the fullScreen takeover from
   * useBrowseModeSessionPrompt.
   */
  isBrowseModePickerOpen: boolean;
  /**
   * Captures the customize-sheet form state at the moment the user picked
   * "Apply without saving". When set, the SessionPrompt re-opens the
   * customize sheet with these values on its next mount — used by the
   * preview bar's exit X so the user lands back where they were instead
   * of at the picker's mode list. Cleared after restoration.
   */
  customizeRestoreSnapshot: {
    editingPresetId: number | null;
    config: BrowseModeConfig;
    name: string;
    description: string;
    default_battery: SocialBattery | null;
  } | null;
}

interface BrowseModeAction {
  setActiveBuiltInBrowseMode: (id: BuiltInBrowseModeId) => void;
  setActiveCustomBrowseMode: (preset: CustomBrowseModePreset) => Promise<void>;
  clearActiveBrowseMode: () => void;
  fetchCustomBrowseModePresets: () => Promise<void>;
  saveCustomBrowseModePreset: (
    name: string,
    description: string,
    config: BrowseModeConfig,
    defaultBattery: SocialBattery | null,
  ) => Promise<CustomBrowseModePreset>;
  updateCustomBrowseModePreset: (
    id: number,
    patch: {
      name?: string;
      description?: string;
      config?: BrowseModeConfig;
      default_battery?: SocialBattery | null;
    },
  ) => Promise<void>;
  deleteCustomBrowseModePreset: (id: number) => Promise<void>;
  openBrowseModePicker: () => void;
  closeBrowseModePicker: () => void;
  setCustomizeRestoreSnapshot: (snap: BrowseModeState['customizeRestoreSnapshot']) => void;
}

const initialState: BrowseModeState = {
  activeBrowseMode: null,
  customBrowseModePresets: [],
  customBrowseModePresetsLoading: false,
  isBrowseModePickerOpen: false,
  customizeRestoreSnapshot: null,
};

export type BrowseModeSlice = BrowseModeState & BrowseModeAction;

export const createBrowseModeSlice: SliceStateCreator<BrowseModeSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,

    setActiveBuiltInBrowseMode: (id) => {
      const built = BUILT_IN_BROWSE_MODES[id];
      set(
        () => ({
          activeBrowseMode: { kind: 'built_in', id: built.id, config: built.config },
        }),
        false,
        'browseMode/setActiveBuiltIn',
      );
    },

    setActiveCustomBrowseMode: async (preset) => {
      set(
        () => ({
          activeBrowseMode: {
            kind: 'custom',
            id: preset.id,
            name: preset.name,
            config: preset.config,
            default_battery: preset.default_battery,
          },
        }),
        false,
        'browseMode/setActiveCustom',
      );
      try {
        const updated = await markBrowseModePresetUsed(preset.id);
        set(
          (state) => ({
            customBrowseModePresets: state.customBrowseModePresets
              .map((p) => (p.id === updated.id ? updated : p))
              .sort(sortByLastUsed),
          }),
          false,
          'browseMode/markUsed',
        );
      } catch {
        // last_used_at bump is best-effort; don't block activation on a network blip.
      }
    },

    clearActiveBrowseMode: () => set(() => ({ activeBrowseMode: null }), false, 'browseMode/clear'),

    fetchCustomBrowseModePresets: async () => {
      set(() => ({ customBrowseModePresetsLoading: true }), false, 'browseMode/fetchStart');
      try {
        const presets = await getBrowseModePresets();
        set(
          () => ({
            customBrowseModePresets: presets.slice().sort(sortByLastUsed),
            customBrowseModePresetsLoading: false,
          }),
          false,
          'browseMode/fetchSuccess',
        );
      } catch {
        set(() => ({ customBrowseModePresetsLoading: false }), false, 'browseMode/fetchError');
      }
    },

    saveCustomBrowseModePreset: async (name, description, config, defaultBattery) => {
      const created = await createBrowseModePreset({
        name,
        description,
        config,
        default_battery: defaultBattery,
      });
      set(
        (state) => ({
          customBrowseModePresets: [...state.customBrowseModePresets, created].sort(sortByLastUsed),
        }),
        false,
        'browseMode/savePreset',
      );
      return created;
    },

    updateCustomBrowseModePreset: async (id, patch) => {
      const updated = await updateBrowseModePreset(id, patch);
      set(
        (state) => ({
          customBrowseModePresets: state.customBrowseModePresets
            .map((p) => (p.id === id ? updated : p))
            .sort(sortByLastUsed),
          // Also keep the active mode in sync if it's the one being edited.
          activeBrowseMode:
            state.activeBrowseMode?.kind === 'custom' && state.activeBrowseMode.id === id
              ? {
                  kind: 'custom',
                  id: updated.id,
                  name: updated.name,
                  config: updated.config,
                  default_battery: updated.default_battery,
                }
              : state.activeBrowseMode,
        }),
        false,
        'browseMode/updatePreset',
      );
    },

    deleteCustomBrowseModePreset: async (id) => {
      await deleteBrowseModePreset(id);
      set(
        (state) => ({
          customBrowseModePresets: state.customBrowseModePresets.filter((p) => p.id !== id),
          activeBrowseMode:
            state.activeBrowseMode?.kind === 'custom' && state.activeBrowseMode.id === id
              ? null
              : state.activeBrowseMode,
        }),
        false,
        'browseMode/deletePreset',
      );
    },

    openBrowseModePicker: () =>
      set(() => ({ isBrowseModePickerOpen: true }), false, 'browseMode/openPicker'),

    closeBrowseModePicker: () =>
      set(() => ({ isBrowseModePickerOpen: false }), false, 'browseMode/closePicker'),

    setCustomizeRestoreSnapshot: (snap) =>
      set(() => ({ customizeRestoreSnapshot: snap }), false, 'browseMode/setRestoreSnapshot'),
  };

  function sortByLastUsed(a: CustomBrowseModePreset, b: CustomBrowseModePreset) {
    const ta = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
    const tb = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
    if (ta !== tb) return tb - ta;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  }
};
