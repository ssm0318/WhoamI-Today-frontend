import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Icon from '@components/_common/icon/Icon';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { BUILT_IN_BROWSE_MODE_LIST } from '@constants/browseMode';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { ActiveBrowseMode, BuiltInBrowseModeId, CustomBrowseModePreset } from '@models/browseMode';
import { useBoundStore } from '@stores/useBoundStore';
import { builtInKey, customKey, HiddenModeKey } from '@utils/browseModeHiddenModes';
import { isBuiltInPicked, isCustomPicked, readLastPickedMode } from '@utils/browseModeLastPick';

export type ModeChoice =
  | { kind: 'built_in'; id: BuiltInBrowseModeId }
  | { kind: 'custom'; preset: CustomBrowseModePreset };

interface BrowseModeStepModeProps {
  presets: CustomBrowseModePreset[];
  /** Currently active mode in this session (used as a fallback for pre-selection). */
  lastActive: ActiveBrowseMode | null;
  syncBattery: boolean;
  /**
   * "Don't show me again today" checkbox state. Suppresses the auto-prompt
   * until local end-of-day. Manual-open via the header still works.
   */
  skipToday: boolean;
  /**
   * Whether to actually render the skip-today checkbox. We only show it on
   * the auto-prompt path (full-screen takeover). When the user taps the
   * header eye icon to manually open the picker, they're explicitly
   * engaging — not the moment to ask "should I stop bothering you?"
   */
  showSkipTodayCheckbox: boolean;
  /**
   * Modes the user has chosen to hide from the picker. Covers both built-ins
   * and custom presets — same hide affordance for both, since the user just
   * wants a clean list either way. See {@link HiddenModeKey}.
   */
  hiddenModeKeys: HiddenModeKey[];
  onSyncToggle: (next: boolean) => void;
  onSkipTodayToggle: (next: boolean) => void;
  onPick: (choice: ModeChoice) => void;
  onOpenCustomize: () => void;
  /** Open the "tell us what you wish the picker did" sheet. */
  onOpenWishlist: () => void;
  /** Tap the `>` chevron on a built-in: opens customize as a "fork & save". */
  onCloneBuiltIn: (id: BuiltInBrowseModeId) => void;
  onEditPreset: (preset: CustomBrowseModePreset) => void;
  /** Soft-hide (recoverable) a mode from the picker; works for either kind. */
  onHideMode: (key: HiddenModeKey) => void;
  /** Restore a hidden mode back to the picker. */
  onShowMode: (key: HiddenModeKey) => void;
  /** Permanently delete a saved preset (offered only via the Hidden section). */
  onDeleteMode: (preset: CustomBrowseModePreset) => void;
}

function BrowseModeStepMode({
  presets,
  lastActive,
  syncBattery,
  skipToday,
  showSkipTodayCheckbox,
  hiddenModeKeys,
  onSyncToggle,
  onSkipTodayToggle,
  onPick,
  onOpenCustomize,
  onOpenWishlist,
  onCloneBuiltIn,
  onEditPreset,
  onHideMode,
  onShowMode,
  onDeleteMode,
}: BrowseModeStepModeProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'browse_mode' });
  // Battery labels live at the top level (`social_battery.<key>`) — outside our keyPrefix.
  const [tRoot] = useTranslation('translation');
  const userId = useBoundStore((state) => state.myProfile?.id);

  // Edit-list mode: cards swap their `>` chevron for an `✕` remove. Built-in
  // X = hide (per-user localStorage); custom X = delete (with confirm). In
  // edit mode the card body is non-interactive — you're managing, not picking.
  const [editListMode, setEditListMode] = useState(false);

  // Hidden modes never appear in the main list — even in edit mode they
  // surface only via the "Hidden" section below (so the same item never
  // shows twice). Same treatment for built-ins and custom presets.
  const isBuiltInHidden = (id: BuiltInBrowseModeId) => hiddenModeKeys.includes(builtInKey(id));
  const isCustomHidden = (id: number) => hiddenModeKeys.includes(customKey(id));
  const visibleBuiltIns = BUILT_IN_BROWSE_MODE_LIST.filter((m) => !isBuiltInHidden(m.id));
  const visiblePresets = presets.filter((p) => !isCustomHidden(p.id));
  const hiddenBuiltIns = BUILT_IN_BROWSE_MODE_LIST.filter((m) => isBuiltInHidden(m.id));
  const hiddenPresets = presets.filter((p) => isCustomHidden(p.id));
  const hasHidden = hiddenBuiltIns.length > 0 || hiddenPresets.length > 0;

  // Selection precedence: in-session active mode wins (so the user can see
  // "what am I currently in" when they re-open the picker mid-session). When
  // there's no active mode, fall back to the persisted "last picked" hint —
  // and if THAT points to a custom preset that's since been deleted, drop it.
  // If we still have nothing, highlight Full social as the implicit baseline
  // because no-mode-set is functionally identical to Full social (all tabs).
  // Two sources so the badge label can differ: active → "Current",
  // last_picked → "Last used".
  type SelectionSource = 'active' | 'last_picked' | null;
  const rawStored = userId ? readLastPickedMode(userId) : null;
  const storedOrphan = (() => {
    if (!rawStored?.startsWith('custom:')) return false;
    const id = Number(rawStored.slice('custom:'.length));
    return !presets.some((p) => p.id === id);
  })();
  const stored = storedOrphan ? null : rawStored;
  const showImplicitBaseline = !lastActive && !stored;
  const builtInSource = (id: BuiltInBrowseModeId): SelectionSource => {
    if (lastActive?.kind === 'built_in' && (lastActive.id as BuiltInBrowseModeId) === id) {
      return 'active';
    }
    if (lastActive) return null;
    if (stored && isBuiltInPicked(stored, id)) return 'last_picked';
    if (showImplicitBaseline && id === 'very_social') return 'active';
    return null;
  };
  const customSource = (id: number): SelectionSource => {
    if (lastActive?.kind === 'custom' && lastActive.id === id) return 'active';
    if (lastActive) return null;
    if (stored && isCustomPicked(stored, id)) return 'last_picked';
    return null;
  };

  const stopCardClick = (e: MouseEvent) => e.stopPropagation();

  return (
    <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
      <Icon name="home_indicator" />
      <Layout.FlexCol alignItems="center" gap={4} pt={4} ph={16}>
        <Typo type="title-large">{t('steps.mode.title')}</Typo>
        <EditListToggle type="button" onClick={() => setEditListMode((v) => !v)}>
          <Typo type="label-large" color="PRIMARY">
            {editListMode ? t('steps.mode.edit_done') : t('steps.mode.edit_list')}
          </Typo>
        </EditListToggle>
      </Layout.FlexCol>

      <Layout.FlexCol w="100%" gap={8} pt={16} ph={16}>
        {visibleBuiltIns.map((mode) => {
          const source = builtInSource(mode.id);
          const selected = source !== null && !editListMode;
          const batteryEmoji = SocialBatteryChipAssets[mode.suggestedBattery].emoji ?? '';
          const batteryLabel = tRoot(`social_battery.${mode.suggestedBattery}`);
          const handleCardClick = editListMode
            ? undefined
            : () => onPick({ kind: 'built_in', id: mode.id });
          return (
            <ModeCard
              key={mode.id}
              role={editListMode ? undefined : 'button'}
              $selected={selected}
              $editing={editListMode}
              onClick={handleCardClick}
            >
              <Layout.FlexRow gap={12} alignItems="center" w="100%">
                <ModeEmoji>{mode.emoji}</ModeEmoji>
                <Layout.FlexCol alignItems="flex-start" gap={2} flex={1}>
                  <Layout.FlexRow gap={6} alignItems="center" style={{ flexWrap: 'wrap' }}>
                    <Typo type="title-small">{t(`modes.${mode.i18nKey}.name`)}</Typo>
                    {!editListMode && source && (
                      <SelectedBadge>
                        <Typo type="label-small" color="PRIMARY">
                          {t(
                            source === 'active'
                              ? 'steps.mode.current_badge'
                              : 'steps.mode.last_used_badge',
                          )}
                        </Typo>
                      </SelectedBadge>
                    )}
                  </Layout.FlexRow>
                  <Typo type="body-small" color="MEDIUM_GRAY">
                    {t(`modes.${mode.i18nKey}.description`)}
                  </Typo>
                  <BatteryHint>
                    <Typo type="label-small" color={syncBattery ? 'DARK_GRAY' : 'MEDIUM_GRAY'}>
                      {t('steps.mode.battery_hint', {
                        emoji: batteryEmoji,
                        label: String(batteryLabel),
                      })}
                    </Typo>
                  </BatteryHint>
                </Layout.FlexCol>
                <CardActions onClick={stopCardClick}>
                  {editListMode ? (
                    <CardIconButton
                      type="button"
                      aria-label={String(
                        t('steps.mode.hide_builtin_aria', {
                          name: t(`modes.${mode.i18nKey}.name`),
                        }),
                      )}
                      onClick={(e) => {
                        stopCardClick(e);
                        onHideMode(builtInKey(mode.id));
                      }}
                    >
                      <SvgIcon name="close" size={18} />
                    </CardIconButton>
                  ) : (
                    <CardIconButton
                      type="button"
                      aria-label={String(
                        t('steps.mode.clone_builtin_aria', {
                          name: t(`modes.${mode.i18nKey}.name`),
                        }),
                      )}
                      onClick={(e) => {
                        stopCardClick(e);
                        onCloneBuiltIn(mode.id);
                      }}
                    >
                      <SvgIcon name="chevron_right" size={18} />
                    </CardIconButton>
                  )}
                </CardActions>
              </Layout.FlexRow>
            </ModeCard>
          );
        })}

        {visiblePresets.length > 0 && (
          <Layout.FlexCol w="100%" gap={6} pt={4}>
            <Typo type="label-medium" color="DARK_GRAY">
              {t('steps.mode.saved_label')}
            </Typo>
            {visiblePresets.map((preset) => {
              const source = customSource(preset.id);
              const selected = source !== null && !editListMode;
              const battery = preset.default_battery;
              const batteryEmoji = battery ? SocialBatteryChipAssets[battery].emoji ?? '' : '';
              const batteryLabel = battery ? tRoot(`social_battery.${battery}`) : '';
              const handleCardClick = editListMode
                ? undefined
                : () => onPick({ kind: 'custom', preset });
              return (
                <ModeCard
                  key={preset.id}
                  role={editListMode ? undefined : 'button'}
                  $selected={selected}
                  $editing={editListMode}
                  onClick={handleCardClick}
                >
                  <Layout.FlexRow gap={12} alignItems="center" w="100%">
                    <ModeEmoji>✨</ModeEmoji>
                    <Layout.FlexCol alignItems="flex-start" gap={2} flex={1}>
                      <Layout.FlexRow gap={6} alignItems="center" style={{ flexWrap: 'wrap' }}>
                        <Typo type="title-small">{preset.name}</Typo>
                        {!editListMode && source && (
                          <SelectedBadge>
                            <Typo type="label-small" color="PRIMARY">
                              {t(
                                source === 'active'
                                  ? 'steps.mode.current_badge'
                                  : 'steps.mode.last_used_badge',
                              )}
                            </Typo>
                          </SelectedBadge>
                        )}
                      </Layout.FlexRow>
                      <Typo type="body-small" color="MEDIUM_GRAY">
                        {/* The user-provided description wins; we only fall back
                            to the auto tab-list when they haven't written one,
                            so saved cards aren't redundant ("Friends · Update"
                            under a name like "Friends Update mode"). */}
                        {preset.description?.trim()
                          ? preset.description
                          : preset.config.tabs.map((tab) => t(`tabs.${tab}`)).join(' · ')}
                      </Typo>
                      {battery && (
                        <BatteryHint>
                          <Typo
                            type="label-small"
                            color={syncBattery ? 'DARK_GRAY' : 'MEDIUM_GRAY'}
                          >
                            {t('steps.mode.battery_hint', {
                              emoji: batteryEmoji,
                              label: String(batteryLabel),
                            })}
                          </Typo>
                        </BatteryHint>
                      )}
                    </Layout.FlexCol>
                    <CardActions onClick={stopCardClick}>
                      {editListMode ? (
                        <CardIconButton
                          type="button"
                          aria-label={String(
                            t('steps.mode.hide_preset_aria', { name: preset.name }),
                          )}
                          onClick={(e) => {
                            stopCardClick(e);
                            onHideMode(customKey(preset.id));
                          }}
                        >
                          <SvgIcon name="close" size={18} />
                        </CardIconButton>
                      ) : (
                        <CardIconButton
                          type="button"
                          aria-label={String(
                            t('steps.mode.edit_preset_aria', { name: preset.name }),
                          )}
                          onClick={(e) => {
                            stopCardClick(e);
                            onEditPreset(preset);
                          }}
                        >
                          <SvgIcon name="chevron_right" size={18} />
                        </CardIconButton>
                      )}
                    </CardActions>
                  </Layout.FlexRow>
                </ModeCard>
              );
            })}
          </Layout.FlexCol>
        )}

        {/* Restore section: only visible in edit-list mode and only when something
            has actually been hidden — keeps the surface clean otherwise. Both
            kinds of mode (built-in and custom preset) appear here together so
            the user has one place to look for "where did my mode go?". Saved
            presets get an extra "Delete forever" link — the actual delete is
            kept behind this two-step (hide first, then delete) so a stray X
            tap can't permanently destroy the user's work. */}
        {editListMode && hasHidden && (
          <Layout.FlexCol w="100%" gap={6} pt={8}>
            <Typo type="label-medium" color="DARK_GRAY">
              {t('steps.mode.hidden_label')}
            </Typo>
            {hiddenBuiltIns.map((mode) => (
              <HiddenRow key={mode.id}>
                <ModeEmoji>{mode.emoji}</ModeEmoji>
                <Layout.FlexCol alignItems="flex-start" flex={1}>
                  <Typo type="title-small" color="MEDIUM_GRAY">
                    {t(`modes.${mode.i18nKey}.name`)}
                  </Typo>
                </Layout.FlexCol>
                <RestoreButton type="button" onClick={() => onShowMode(builtInKey(mode.id))}>
                  <Typo type="label-large" color="PRIMARY">
                    {t('steps.mode.show_again')}
                  </Typo>
                </RestoreButton>
              </HiddenRow>
            ))}
            {hiddenPresets.map((preset) => (
              <HiddenRow key={preset.id}>
                <ModeEmoji>✨</ModeEmoji>
                <Layout.FlexCol alignItems="flex-start" flex={1}>
                  <Typo type="title-small" color="MEDIUM_GRAY">
                    {preset.name}
                  </Typo>
                </Layout.FlexCol>
                <RestoreButton type="button" onClick={() => onShowMode(customKey(preset.id))}>
                  <Typo type="label-large" color="PRIMARY">
                    {t('steps.mode.show_again')}
                  </Typo>
                </RestoreButton>
                <RestoreButton type="button" onClick={() => onDeleteMode(preset)}>
                  <Typo type="label-large" color="WARNING">
                    {t('steps.mode.delete_forever')}
                  </Typo>
                </RestoreButton>
              </HiddenRow>
            ))}
          </Layout.FlexCol>
        )}

        {!editListMode && (
          <Layout.FlexCol w="100%" alignItems="flex-start">
            <CustomizeLink type="button" onClick={onOpenCustomize}>
              <Typo type="title-small" color="PRIMARY">
                {t('steps.mode.customize')}
              </Typo>
            </CustomizeLink>
            {/* Wishlist entry — separate from customize because "send feedback"
                is a different intent than "make a saved mode", and pairing them
                inside the customize sheet conflated the two. */}
            <CustomizeLink type="button" onClick={onOpenWishlist}>
              <Typo type="title-small" color="PRIMARY">
                {t('steps.mode.wishlist_link')}
              </Typo>
            </CustomizeLink>
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>

      {!editListMode && (
        <>
          <SyncToggleRow w="100%" ph={16} pv={12} mt={8}>
            <SyncCheckbox
              type="button"
              aria-pressed={syncBattery}
              onClick={() => onSyncToggle(!syncBattery)}
            >
              <CheckSquare $checked={syncBattery} />
              <Layout.FlexCol alignItems="flex-start" gap={2}>
                <Typo type="body-medium">{t('steps.mode.sync_toggle')}</Typo>
                <Typo type="label-small" color="DARK_GRAY">
                  {t('steps.mode.sync_subtitle')}
                </Typo>
              </Layout.FlexCol>
            </SyncCheckbox>
          </SyncToggleRow>

          {showSkipTodayCheckbox && (
            <>
              <SyncToggleRow w="100%" ph={16} pv={8}>
                <SyncCheckbox
                  type="button"
                  aria-pressed={skipToday}
                  onClick={() => onSkipTodayToggle(!skipToday)}
                >
                  <CheckSquare $checked={skipToday} />
                  <Typo type="body-medium">{t('skip_today.label')}</Typo>
                </SyncCheckbox>
              </SyncToggleRow>

              <Layout.FlexRow w="100%" ph={16} pt={4} pb={4}>
                <Typo type="label-small" color="MEDIUM_GRAY">
                  {t('skip_today.hint')}
                </Typo>
              </Layout.FlexRow>
            </>
          )}
        </>
      )}

      <Layout.FlexRow w="100%" pb={20} />
    </Layout.FlexCol>
  );
}

export default BrowseModeStepMode;

// ModeCard is a div (not a <button>) because it nests inner <button> icons
// for the chevron / X — <button> inside <button> is invalid HTML.
// role="button" + tabIndex give it the same a11y semantics. Click is the
// only activation we surface; keyboard activation isn't critical here
// because the inner chevron / X covers that path.
const ModeCard = styled.div<{ $selected: boolean; $editing: boolean }>`
  background: ${({ $selected }) => ($selected ? '#F3E8FF' : Colors.WHITE)};
  border: 1px solid ${({ $selected }) => ($selected ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  border-radius: 12px;
  padding: 12px 14px;
  width: 100%;
  cursor: ${({ $editing }) => ($editing ? 'default' : 'pointer')};
  text-align: left;
  &:hover {
    border-color: ${({ $editing }) => ($editing ? Colors.LIGHT_GRAY : Colors.PRIMARY)};
  }
`;

const ModeEmoji = styled.span`
  font-size: 28px;
  line-height: 1;
`;

const SelectedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${Colors.WHITE};
  border: 1px solid ${Colors.PRIMARY};
  border-radius: 8px;
  padding: 0 6px;
`;

const BatteryHint = styled.span`
  display: inline-flex;
  align-items: center;
  margin-top: 2px;
`;

const CardActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const CardIconButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${Colors.LIGHT};
  }
`;

const EditListToggle = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const HiddenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${Colors.WHITE};
  border: 1px dashed ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  padding: 8px 12px;
`;

const RestoreButton = styled.button`
  background: none;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
`;

const CustomizeLink = styled.button`
  background: none;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  align-self: flex-start;
`;

const SyncToggleRow = styled(Layout.FlexRow)`
  border-top: 1px solid ${Colors.LIGHT};
  background: ${Colors.WHITE};
`;

const SyncCheckbox = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 0;
  text-align: left;
`;

const CheckSquare = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${({ $checked }) => ($checked ? Colors.PRIMARY : Colors.MEDIUM_GRAY)};
  background: ${({ $checked }) => ($checked ? Colors.PRIMARY : 'transparent')};
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 4px;
    height: 8px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: translateY(-1px) rotate(45deg);
  }
`;
