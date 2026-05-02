import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { BUILT_IN_BROWSE_MODES } from '@constants/browseMode';
import { Colors, SvgIcon, Typo } from '@design-system';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { useTrackEvent } from '@hooks/useTrackEvent';
import {
  ActiveBrowseMode,
  BrowseModeConfig,
  BuiltInBrowseModeId,
  CustomBrowseModePreset,
} from '@models/browseMode';
import { ComponentVisibility, DEFAULT_VISIBILITY, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { logBrowseModePick } from '@utils/apis/browseMode';
import { postCheckIn } from '@utils/apis/checkIn';
import { writeLastPickedAt } from '@utils/browseModeActiveSession';
import { HiddenModeKey, readHiddenModes, writeHiddenModes } from '@utils/browseModeHiddenModes';
import { saveLastPickedMode } from '@utils/browseModeLastPick';
import BrowseModeCustomizeSheet from './BrowseModeCustomizeSheet';
import BrowseModeStepMode, { ModeChoice } from './BrowseModeStepMode';
import BrowseModeWishlistSheet from './BrowseModeWishlistSheet';

const SYNC_PREF_KEY = 'browse_mode_sync_battery_pref';

interface BrowseModeSessionPromptProps {
  visible: boolean;
  onDismiss: () => void;
  onFinish: () => void;
  /**
   * When true, render as a full-screen takeover (opaque, blocks all underlying UI)
   * instead of the bottom-sheet style. Used for the auto-prompt at session start so
   * the user picks their vibe BEFORE being flooded with the app's content.
   */
  fullScreen?: boolean;
}

function readSyncPref(): boolean {
  const stored = localStorage.getItem(SYNC_PREF_KEY);
  if (stored === null) return true; // default ON
  return stored === 'true';
}

function writeSyncPref(value: boolean) {
  localStorage.setItem(SYNC_PREF_KEY, value ? 'true' : 'false');
}

function BrowseModeSessionPrompt({
  visible,
  onDismiss,
  onFinish,
  fullScreen = false,
}: BrowseModeSessionPromptProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'browse_mode' });
  // Battery labels are top-level (`social_battery.<key>`) — separate `t` without a keyPrefix.
  const [tRoot] = useTranslation('translation');
  const navigate = useNavigate();
  const trackEvent = useTrackEvent();
  usePreventScroll(fullScreen && visible);

  const [syncBattery, setSyncBattery] = useState<boolean>(readSyncPref);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  // Tracks customize-sheet outcome so closeCustomize knows whether to fire
  // an "abandoned" event. Set by the save / apply-without-saving handlers
  // before they call closeCustomize.
  const customizeOutcomeRef = useRef<'pending' | 'saved' | 'applied'>('pending');
  // True iff the user has activated a mode in this picker session — used
  // by the dismiss handler to decide between `picked` (skip event suppressed)
  // and `skipped`. applyMode and apply-without-saving both flip this on.
  const pickedInSessionRef = useRef(false);
  // When set, BrowseModeCustomizeSheet opens in EDIT mode prefilled with this
  // preset's values. Cleared on close so the next "Add a new browsing mode"
  // tap starts from the active mode again.
  const [editingPreset, setEditingPreset] = useState<CustomBrowseModePreset | null>(null);
  // When set, the customize sheet opens prefilled with these values but Save
  // creates a NEW custom preset (used for "fork a built-in" via the chevron).
  const [cloneSeed, setCloneSeed] = useState<{
    config: BrowseModeConfig;
    name: string;
    description?: string;
    default_battery: SocialBattery | null;
  } | null>(null);
  const [pendingDeletePreset, setPendingDeletePreset] = useState<CustomBrowseModePreset | null>(
    null,
  );
  const [hiddenModeKeys, setHiddenModeKeys] = useState<HiddenModeKey[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const checkIn = useBoundStore((state) => state.checkIn);
  const fetchCheckIn = useBoundStore((state) => state.fetchCheckIn);
  const customPresets = useBoundStore((state) => state.customBrowseModePresets);
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const myProfile = useBoundStore((state) => state.myProfile);
  const setActiveBuiltIn = useBoundStore((state) => state.setActiveBuiltInBrowseMode);
  const setActiveCustom = useBoundStore((state) => state.setActiveCustomBrowseMode);
  const deleteCustomBrowseModePreset = useBoundStore((state) => state.deleteCustomBrowseModePreset);
  const openToast = useBoundStore((state) => state.openToast);

  const handleSyncToggle = useCallback(
    (next: boolean) => {
      setSyncBattery(next);
      writeSyncPref(next);
      trackEvent('browse_mode_sync_pref_changed', { value: next ? 'on' : 'off' });
    },
    [trackEvent],
  );

  // Hydrate hidden mode keys from localStorage every time the picker opens —
  // captures changes made elsewhere (e.g. another tab) without requiring us
  // to thread the value through the store.
  useEffect(() => {
    if (visible && myProfile?.id) {
      setHiddenModeKeys(readHiddenModes(myProfile.id));
    }
  }, [visible, myProfile?.id]);

  // Picker funnel: prompt shown vs skipped vs picked.
  // Reset session flags every time the picker becomes visible so the next
  // close-without-pick correctly counts as `skipped`. `full_screen` flag
  // distinguishes the auto-prompt path from the sidebar manual-open path,
  // since their conversion rates probably differ.
  useEffect(() => {
    if (visible) {
      pickedInSessionRef.current = false;
      trackEvent('browse_mode_prompt_shown', {
        full_screen: fullScreen ? 'true' : 'false',
      });
    }
  }, [visible, fullScreen, trackEvent]);

  const handleDismiss = useCallback(() => {
    // Skip event only fires when nothing was picked — picks are
    // mutually exclusive with skips in the funnel.
    if (!pickedInSessionRef.current) {
      trackEvent('browse_mode_prompt_skipped', {
        full_screen: fullScreen ? 'true' : 'false',
      });
    }
    onDismiss();
  }, [fullScreen, onDismiss, trackEvent]);

  // Wraps setCustomizeOpen(true) so every entry path into the customize
  // sheet (new / edit / clone / restore-from-snapshot) emits a single
  // `customize_opened` event with a `source` param distinguishing them.
  // The outcome ref resets to `pending` here so the abandon-tracking in
  // closeCustomize starts fresh per entry.
  // Defined ahead of the customize-restore useEffect that depends on it.
  const openCustomize = useCallback(
    (source: 'new' | 'edit' | 'clone_built_in' | 'restore_snapshot') => {
      customizeOutcomeRef.current = 'pending';
      setCustomizeOpen(true);
      trackEvent('browse_mode_customize_opened', { source });
    },
    [trackEvent],
  );

  // When the picker opens with a customize-restore snapshot in the store
  // (the preview bar's exit-X path), re-enter the customize sheet with the
  // same form state the user had before applying without saving.
  const customizeRestoreSnapshot = useBoundStore((state) => state.customizeRestoreSnapshot);
  const setCustomizeRestoreSnapshot = useBoundStore((state) => state.setCustomizeRestoreSnapshot);
  useEffect(() => {
    if (!visible || !customizeRestoreSnapshot) return;
    const { editingPresetId, config, name, description, default_battery } =
      customizeRestoreSnapshot;
    const editingMatch = editingPresetId
      ? customPresets.find((p) => p.id === editingPresetId) ?? null
      : null;
    setEditingPreset(editingMatch);
    setCloneSeed({ config, name, description, default_battery });
    openCustomize('restore_snapshot');
    setCustomizeRestoreSnapshot(null);
  }, [
    visible,
    customizeRestoreSnapshot,
    customPresets,
    setCustomizeRestoreSnapshot,
    openCustomize,
  ]);

  const persistHiddenModes = useCallback(
    (next: HiddenModeKey[]) => {
      setHiddenModeKeys(next);
      if (myProfile?.id) writeHiddenModes(myProfile.id, next);
    },
    [myProfile?.id],
  );

  const handleHideMode = useCallback(
    (modeKey: HiddenModeKey) => {
      // Idempotent: only track when the key is genuinely added (not a no-op
      // re-hide) so the count reflects actual user actions, not React StrictMode
      // double-renders.
      if (!hiddenModeKeys.includes(modeKey)) {
        trackEvent('browse_mode_built_in_hidden', { mode_id: String(modeKey) });
      }
      persistHiddenModes(
        hiddenModeKeys.includes(modeKey) ? hiddenModeKeys : [...hiddenModeKeys, modeKey],
      );
    },
    [hiddenModeKeys, persistHiddenModes, trackEvent],
  );

  const handleShowMode = useCallback(
    (modeKey: HiddenModeKey) => {
      if (hiddenModeKeys.includes(modeKey)) {
        trackEvent('browse_mode_built_in_unhidden', { mode_id: String(modeKey) });
      }
      persistHiddenModes(hiddenModeKeys.filter((x) => x !== modeKey));
    },
    [hiddenModeKeys, persistHiddenModes, trackEvent],
  );

  const handleCloneBuiltIn = useCallback(
    (id: BuiltInBrowseModeId) => {
      const built = BUILT_IN_BROWSE_MODES[id];
      const baseName = String(t(`modes.${built.i18nKey}.name`));
      setCloneSeed({
        config: built.config,
        // Suffix nudges users that this is THEIR copy — they can rename freely.
        name: String(t('steps.mode.clone_name_suffix', { name: baseName })),
        default_battery: built.suggestedBattery,
      });
      setEditingPreset(null);
      openCustomize('clone_built_in');
    },
    [t, openCustomize],
  );

  const applyMode = useCallback(
    async (
      mode: ActiveBrowseMode,
      suggestedBattery: SocialBattery | null,
      // `keepPickerOpen` is the post-Save flow's pivot: we activate the new
      // preset (so it shows as "Current" in the picker list) but leave the
      // picker mounted instead of closing it. The battery-adjust toast is
      // also suppressed because tapping the toast's "Adjust" link would
      // navigate AWAY while the picker is still open — confusing.
      { keepPickerOpen = false }: { keepPickerOpen?: boolean } = {},
    ) => {
      if (mode.kind === 'built_in') {
        setActiveBuiltIn(mode.id);
      } else {
        await setActiveCustom({
          kind: 'custom',
          id: mode.id,
          name: mode.name,
          // Description is metadata for the picker card; the active-mode
          // store slice doesn't read it. Empty string is the safe default
          // since ActiveBrowseMode doesn't carry description.
          description: '',
          config: mode.config,
          default_battery: mode.default_battery,
          last_used_at: null,
          created_at: '',
          updated_at: '',
        });
      }
      pickedInSessionRef.current = true;
      if (myProfile?.id) {
        saveLastPickedMode(myProfile.id, mode);
        // Stamp the pick time. The auto-prompt's 15-minute freshness window
        // starts from this moment; any pick path (auto-prompt, manual
        // sidebar, post-Save activation) bumps the timer the same way.
        writeLastPickedAt(myProfile.id);
      }

      // Append-only pick log on the backend (research analytics ground
      // truth) + a parallel Firebase Analytics event via the WebView
      // bridge. Both fire-and-forget; failures are silent so analytics
      // never blocks the UI.
      const eventParams: Record<string, string | number> = {
        kind: mode.kind,
        keep_picker_open: keepPickerOpen ? 'true' : 'false',
        battery_synced: syncBattery ? 'true' : 'false',
      };
      if (mode.kind === 'built_in') {
        eventParams.mode_id = mode.id;
        logBrowseModePick({ kind: 'built_in', built_in_id: mode.id });
      } else {
        eventParams.mode_id = `custom:${mode.id}`;
        eventParams.preset_id = mode.id;
        logBrowseModePick({ kind: 'custom', preset_id: mode.id });
      }
      trackEvent('browse_mode_picked', eventParams);

      let batteryApplied: SocialBattery | null = null;
      if (syncBattery && suggestedBattery) {
        try {
          // Existing check-in → spread it whole and override social_battery
          // (preserves the user's actual visibility, mood, thought, etc.).
          // No check-in yet → create a fresh one with empty content fields
          // and DEFAULT_VISIBILITY values; only the battery carries
          // meaningful content. Backend requires `visibility` on create,
          // so we always pass it.
          if (checkIn) {
            await postCheckIn({
              ...checkIn,
              social_battery: suggestedBattery,
            });
          } else {
            await postCheckIn({
              social_battery: suggestedBattery,
              mood: [],
              thought: '',
              track_id: '',
              visibility: [ComponentVisibility.FRIENDS],
              battery_visibility: DEFAULT_VISIBILITY.battery,
              mood_visibility: DEFAULT_VISIBILITY.mood,
              song_visibility: DEFAULT_VISIBILITY.song,
              thought_visibility: DEFAULT_VISIBILITY.thought,
            });
          }
          await fetchCheckIn();
          batteryApplied = suggestedBattery;
        } catch {
          // Sync is best-effort — don't block mode activation on a battery write failure.
        }
      }

      if (!keepPickerOpen) onFinish();

      // Confirm the mode change with a toast — "Browsing in <name> mode".
      // When the battery sync also fired, fold the battery into the same
      // toast so we don't queue two notifications back-to-back; the
      // "Adjust" action stays in the keepPickerOpen=false flow only,
      // since navigating away while the picker's still open is jarring.
      const modeName =
        mode.kind === 'built_in'
          ? String(t(`modes.${BUILT_IN_BROWSE_MODES[mode.id].i18nKey}.name`))
          : mode.name;
      if (batteryApplied) {
        const emoji = SocialBatteryChipAssets[batteryApplied].emoji ?? '';
        openToast({
          message: String(
            t('toasts.browsing_in_with_battery', {
              name: modeName,
              emoji,
              label: tRoot(`social_battery.${batteryApplied}`),
            }),
          ),
          ...(keepPickerOpen
            ? {}
            : {
                actionText: String(t('toasts.adjust')),
                action: () => navigate('/update'),
              }),
        });
      } else {
        openToast({
          message: String(t('toasts.browsing_in', { name: modeName })),
        });
      }
    },
    [
      checkIn,
      fetchCheckIn,
      myProfile?.id,
      navigate,
      onFinish,
      openToast,
      trackEvent,
      setActiveBuiltIn,
      setActiveCustom,
      syncBattery,
      t,
      tRoot,
    ],
  );

  const handleModePick = useCallback(
    async (choice: ModeChoice) => {
      if (choice.kind === 'built_in') {
        const built = BUILT_IN_BROWSE_MODES[choice.id];
        await applyMode(
          { kind: 'built_in', id: built.id, config: built.config },
          built.suggestedBattery,
        );
      } else if (choice.kind === 'custom') {
        await applyMode(
          {
            kind: 'custom',
            id: choice.preset.id,
            name: choice.preset.name,
            config: choice.preset.config,
            default_battery: choice.preset.default_battery,
          },
          choice.preset.default_battery,
        );
      }
    },
    [applyMode],
  );

  const closeCustomize = useCallback(() => {
    // Abandon = close without `save` or `apply_without_saving` having
    // fired. Lets us measure how many users open the customize sheet
    // and walk away without committing — a UX pain signal.
    if (customizeOutcomeRef.current === 'pending') {
      trackEvent('browse_mode_customize_abandoned');
    }
    customizeOutcomeRef.current = 'pending';
    setCustomizeOpen(false);
    setEditingPreset(null);
    setCloneSeed(null);
  }, [trackEvent]);

  const handleEditPreset = useCallback(
    (preset: CustomBrowseModePreset) => {
      setCloneSeed(null);
      setEditingPreset(preset);
      openCustomize('edit');
    },
    [openCustomize],
  );

  const handleDeletePreset = useCallback((preset: CustomBrowseModePreset) => {
    setPendingDeletePreset(preset);
  }, []);

  const handleCustomizeSaved = useCallback(async () => {
    customizeOutcomeRef.current = 'saved';
    trackEvent('browse_mode_customize_saved');
    // Save just persists the preset — no auto-activation. The picker stays
    // open and the new / edited preset appears in the saved-modes list;
    // the user explicitly picks it to start browsing in it. Keeps the
    // "create" flow distinct from the "switch" flow so we don't surprise
    // them with a mode change they didn't ask for.
    closeCustomize();
  }, [closeCustomize, trackEvent]);

  const handleCustomizeApplyWithoutSaving = useCallback(
    async (snapshot: {
      config: BrowseModeConfig;
      name: string;
      description: string;
      default_battery: SocialBattery | null;
    }) => {
      // Capture the customize-sheet form state BEFORE closing — so the preview
      // bar's exit X can drop the user back into the same edit/create flow
      // they were in (with their tweaks intact) instead of the picker root.
      useBoundStore.getState().setCustomizeRestoreSnapshot({
        editingPresetId: editingPreset?.id ?? null,
        config: snapshot.config,
        name: snapshot.name,
        description: snapshot.description,
        default_battery: snapshot.default_battery,
      });
      closeCustomize();
      // Ad-hoc mode: write directly to the store (no backend persistence, no
      // last_used_at bump). The id `-1` flags it as transient — store actions
      // refuse to mark it used / mutate it server-side.
      useBoundStore.setState({
        activeBrowseMode: {
          kind: 'custom',
          id: -1,
          name: 'Custom',
          config: snapshot.config,
          default_battery: snapshot.default_battery,
        },
      });
      // Apply-without-saving counts as the user actively picking a
      // configuration to use right now — bump the freshness timer so the
      // auto-prompt doesn't re-fire mid-preview.
      if (myProfile?.id) writeLastPickedAt(myProfile.id);
      pickedInSessionRef.current = true;
      customizeOutcomeRef.current = 'applied';
      // Pick log + Firebase event (best-effort, mirrors applyMode).
      logBrowseModePick({ kind: 'apply_without_saving' });
      trackEvent('browse_mode_picked', {
        kind: 'apply_without_saving',
        keep_picker_open: 'false',
        battery_synced: 'false',
      });
      onFinish();
    },
    [closeCustomize, editingPreset?.id, myProfile?.id, onFinish, trackEvent],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeletePreset) return;
    try {
      await deleteCustomBrowseModePreset(pendingDeletePreset.id);
    } catch {
      // Best-effort: the store will still re-fetch on next open. Surface a toast
      // so the user knows it didn't stick rather than silently failing.
      openToast({ message: String(t('toasts.delete_failed')) });
    } finally {
      setPendingDeletePreset(null);
    }
  }, [deleteCustomBrowseModePreset, openToast, pendingDeletePreset, t]);

  const stepContent = (
    <BrowseModeStepMode
      presets={customPresets}
      lastActive={activeBrowseMode}
      syncBattery={syncBattery}
      hiddenModeKeys={hiddenModeKeys}
      onSyncToggle={handleSyncToggle}
      onPick={handleModePick}
      onOpenCustomize={() => {
        setCloneSeed(null);
        setEditingPreset(null);
        openCustomize('new');
      }}
      onOpenWishlist={() => {
        setWishlistOpen(true);
        trackEvent('browse_mode_wishlist_opened');
      }}
      onCloneBuiltIn={handleCloneBuiltIn}
      onEditPreset={handleEditPreset}
      onHideMode={handleHideMode}
      onShowMode={handleShowMode}
      onDeleteMode={handleDeletePreset}
    />
  );

  return (
    <>
      {fullScreen
        ? createPortal(
            visible && !customizeOpen && !wishlistOpen ? (
              <FullScreenOverlay role="dialog" aria-modal="true">
                <SkipBar>
                  <SkipButton
                    type="button"
                    onClick={handleDismiss}
                    aria-label={String(t('full_screen.skip'))}
                  >
                    <Typo type="label-large" color="MEDIUM_GRAY">
                      {t('full_screen.skip')}
                    </Typo>
                    <SvgIcon name="close" size={20} />
                  </SkipButton>
                </SkipBar>
                <FullScreenBody>{stepContent}</FullScreenBody>
              </FullScreenOverlay>
            ) : null,
            document.body,
          )
        : createPortal(
            <BottomModal
              visible={visible && !customizeOpen && !wishlistOpen}
              onClose={handleDismiss}
            >
              {stepContent}
            </BottomModal>,
            document.body,
          )}
      <BrowseModeCustomizeSheet
        visible={visible && customizeOpen}
        onClose={closeCustomize}
        onSaved={handleCustomizeSaved}
        onApplyWithoutSaving={handleCustomizeApplyWithoutSaving}
        editingPreset={editingPreset}
        cloneSeed={cloneSeed}
      />
      <BrowseModeWishlistSheet
        visible={visible && wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
      <CommonDialog
        visible={!!pendingDeletePreset}
        title={String(t('steps.mode.delete_confirm_title'))}
        content={
          pendingDeletePreset
            ? String(t('steps.mode.delete_confirm_content', { name: pendingDeletePreset.name }))
            : null
        }
        cancelText={String(t('steps.mode.delete_confirm_cancel'))}
        confirmText={String(t('steps.mode.delete_confirm_confirm'))}
        confirmTextColor="WARNING"
        onClickConfirm={handleConfirmDelete}
        onClickClose={() => setPendingDeletePreset(null)}
      />
    </>
  );
}

export default BrowseModeSessionPrompt;

const FullScreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${Colors.WHITE};
  z-index: 2500;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SkipBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
`;

const SkipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
`;

const FullScreenBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8px 24px;
`;
