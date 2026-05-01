import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import {
  ALL_BROWSE_MODE_TABS,
  BUILT_IN_BROWSE_MODES,
  CUSTOMIZE_TEMPLATES,
  TAB_DURATION_OPTIONS,
} from '@constants/browseMode';
import { Colors, Layout, Typo } from '@design-system';
import {
  BrowseModeConfig,
  BrowseModeFilters,
  BrowseModeTabKey,
  CustomBrowseModePreset,
} from '@models/browseMode';
import { SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';

const FILTER_KEYS: (keyof BrowseModeFilters)[] = ['friends_close_only', 'chats_close_only'];

interface BrowseModeCustomizeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (preset: {
    id: number;
    name: string;
    config: BrowseModeConfig;
    default_battery: SocialBattery | null;
  }) => void;
  onApplyWithoutSaving: (snapshot: {
    config: BrowseModeConfig;
    name: string;
    description: string;
    default_battery: SocialBattery | null;
  }) => void;
  /**
   * When provided, the sheet opens in EDIT mode: form prefilled with the
   * preset's name / config / default_battery, "Save" updates instead of
   * creating, and "Apply without saving" still works for one-off tweaks.
   * Wishlist + quick-start templates remain available — useful for
   * starting an edit session by replacing the tab set, etc.
   */
  editingPreset?: CustomBrowseModePreset | null;
  /**
   * "Make a custom version of a built-in" entry: prefills the form with the
   * given seed (config, name suggestion, default battery) but Save still
   * creates a NEW custom preset rather than mutating any built-in. Built-ins
   * are hardcoded constants and intentionally stay immutable; this just gives
   * users a way to fork one and tweak from there.
   */
  cloneSeed?: {
    config: BrowseModeConfig;
    name: string;
    description?: string;
    default_battery: SocialBattery | null;
  } | null;
}

function defaultConfig(seed?: BrowseModeConfig): BrowseModeConfig {
  // Prefer the user's currently active mode (so they can re-edit after
  // "Apply without saving"), then fall back to the selectively_social built-in.
  const base = seed ?? BUILT_IN_BROWSE_MODES.selectively_social.config;
  return {
    tabs: [...base.tabs],
    filters: { ...base.filters },
    sections: { ...base.sections },
    // Preserve per-tab durations so toggling tabs / filters in the form
    // doesn't silently strip a Digital-detox preset's timers.
    tab_durations: base.tab_durations ? { ...base.tab_durations } : undefined,
  };
}

function BrowseModeCustomizeSheet({
  visible,
  onClose,
  onSaved,
  onApplyWithoutSaving,
  editingPreset,
  cloneSeed,
}: BrowseModeCustomizeSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'browse_mode' });
  const saveCustomBrowseModePreset = useBoundStore((state) => state.saveCustomBrowseModePreset);
  const updateCustomBrowseModePreset = useBoundStore((state) => state.updateCustomBrowseModePreset);
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);

  const isEditing = !!editingPreset;

  const [config, setConfig] = useState<BrowseModeConfig>(() =>
    defaultConfig(activeBrowseMode?.config),
  );
  const [defaultBattery, setDefaultBattery] = useState<SocialBattery | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When the sheet opens, seed the form. In edit mode that's the preset's
  // current values. Otherwise, prefer the active mode (so users can tweak
  // rather than start over). When the sheet closes, reset everything.
  useEffect(() => {
    if (visible) {
      // cloneSeed wins over editingPreset on form values: when both are
      // present (preview-bar restore of an edit-in-progress), we want the
      // user's UNSAVED tweaks back, not the preset's saved values.
      // editingPreset is still consulted by handleSave for update-vs-create.
      if (cloneSeed) {
        setConfig(defaultConfig(cloneSeed.config));
        setDefaultBattery(cloneSeed.default_battery);
        setName(cloneSeed.name);
        setDescription(cloneSeed.description ?? '');
      } else if (editingPreset) {
        setConfig(defaultConfig(editingPreset.config));
        setDefaultBattery(editingPreset.default_battery);
        setName(editingPreset.name);
        setDescription(editingPreset.description ?? '');
      } else {
        setConfig(defaultConfig(activeBrowseMode?.config));
        setDefaultBattery(
          activeBrowseMode?.kind === 'custom' ? activeBrowseMode.default_battery : null,
        );
        setName('');
        setDescription('');
      }
      setError(null);
    }
  }, [visible, activeBrowseMode, editingPreset, cloneSeed]);

  const tabsValid = config.tabs.length > 0;

  const applyTemplate = (templateId: string) => {
    const tpl = CUSTOMIZE_TEMPLATES.find((c) => c.id === templateId);
    if (!tpl) return;
    setConfig((prev) => ({
      ...prev,
      tabs: [...tpl.config.tabs],
      filters: { ...tpl.config.filters },
      // Templates fully replace per-tab durations — including clearing them
      // when switching from Digital detox to a non-time-bounded template.
      tab_durations: tpl.config.tab_durations ? { ...tpl.config.tab_durations } : undefined,
    }));
  };

  const setTabDuration = (tab: BrowseModeTabKey, minutes: number | undefined) => {
    setConfig((prev) => {
      const next = { ...(prev.tab_durations ?? {}) };
      if (minutes === undefined) {
        delete next[tab];
      } else {
        next[tab] = minutes;
      }
      const cleaned = Object.keys(next).length > 0 ? next : undefined;
      return { ...prev, tab_durations: cleaned };
    });
  };

  const toggleTab = (tab: BrowseModeTabKey) => {
    setConfig((prev) => {
      const has = prev.tabs.includes(tab);
      return {
        ...prev,
        tabs: has ? prev.tabs.filter((t2) => t2 !== tab) : [...prev.tabs, tab],
      };
    });
  };

  const toggleFilter = (key: keyof BrowseModeFilters) => {
    setConfig((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: !prev.filters[key] },
    }));
  };

  // When the user leaves the name blank, build one from their tab choices —
  // e.g. "Friends · Update · Share" — so they're not blocked from saving over
  // a forgotten field. Editing keeps whatever name was there originally.
  const generateAutoName = (): string => {
    if (config.tabs.length === 0) return '';
    const labels = config.tabs.slice(0, 3).map((tab) => String(t(`tabs.${tab}`)));
    return labels.join(' · ');
  };

  const handleSave = async () => {
    const trimmed = name.trim() || generateAutoName();
    const trimmedDescription = description.trim();
    if (!trimmed) {
      // Tabs are also empty — surface the existing tab error rather than the
      // name error so the user knows what to fix.
      setError(t('steps.customize.errors.name_required'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingPreset) {
        await updateCustomBrowseModePreset(editingPreset.id, {
          name: trimmed,
          description: trimmedDescription,
          config,
          default_battery: defaultBattery,
        });
        onSaved({
          id: editingPreset.id,
          name: trimmed,
          config,
          default_battery: defaultBattery,
        });
      } else {
        const created = await saveCustomBrowseModePreset(
          trimmed,
          trimmedDescription,
          config,
          defaultBattery,
        );
        onSaved({
          id: created.id,
          name: created.name,
          config: created.config,
          default_battery: created.default_battery,
        });
      }
    } catch (e) {
      setError(t('steps.customize.errors.save_failed'));
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} heightMode="full">
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE" pb={32}>
        <Icon name="home_indicator" />
        <Layout.FlexCol alignItems="center" gap={4} pt={4} ph={16}>
          <Typo type="title-large">
            {isEditing ? t('steps.customize.title_edit') : t('steps.customize.title')}
          </Typo>
          {/* No subtitle in either mode — the section labels carry the meaning
              and a separate explanation just adds noise. */}
        </Layout.FlexCol>

        <Layout.FlexCol w="100%" ph={16} pt={16} gap={20}>
          {/* Quick-start templates */}
          <Layout.FlexCol w="100%" gap={6}>
            <Typo type="title-small">{t('steps.customize.templates_section')}</Typo>
            <Typo type="body-small" color="MEDIUM_GRAY">
              {t('steps.customize.templates_subtitle')}
            </Typo>
            {/* w="100%" is needed: without it Layout.FlexCol shrinks to its
                children's intrinsic width and the templates render half-width. */}
            <Layout.FlexCol w="100%" gap={6} pt={4}>
              {CUSTOMIZE_TEMPLATES.map((tpl) => (
                <TemplateButton key={tpl.id} type="button" onClick={() => applyTemplate(tpl.id)}>
                  <TemplateEmoji>{tpl.emoji}</TemplateEmoji>
                  <Layout.FlexCol alignItems="flex-start" gap={2}>
                    <Typo type="title-small">{t(`templates.${tpl.i18nKey}.name`)}</Typo>
                    <Typo type="body-small" color="MEDIUM_GRAY">
                      {t(`templates.${tpl.i18nKey}.description`)}
                    </Typo>
                  </Layout.FlexCol>
                </TemplateButton>
              ))}
            </Layout.FlexCol>
          </Layout.FlexCol>

          {/* Show these tabs */}
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="title-small">{t('steps.customize.tabs_section')}</Typo>
            <Typo type="body-small" color="MEDIUM_GRAY">
              {t('steps.customize.tabs_subtitle')}
            </Typo>
            {ALL_BROWSE_MODE_TABS.map((tab) => {
              const active = config.tabs.includes(tab);
              const duration = config.tab_durations?.[tab];
              return (
                <Layout.FlexRow key={tab} gap={8} alignItems="center" w="100%">
                  <TabPill type="button" $active={active} onClick={() => toggleTab(tab)}>
                    <Typo type="label-large" color={active ? 'PRIMARY' : 'MEDIUM_GRAY'}>
                      {t(`tabs.${tab}`)}
                    </Typo>
                  </TabPill>
                  {/* Duration selector only meaningful when the tab is on.
                      Hidden when tab is off so the form doesn't get noisy. */}
                  {active && (
                    <DurationSelect
                      aria-label={String(
                        t('steps.customize.duration_aria', { tab: t(`tabs.${tab}`) }),
                      )}
                      value={duration === undefined ? '' : String(duration)}
                      onChange={(e) =>
                        setTabDuration(
                          tab,
                          e.target.value === '' ? undefined : Number(e.target.value),
                        )
                      }
                    >
                      {TAB_DURATION_OPTIONS.map((opt) => (
                        <option
                          key={opt.i18nKey}
                          value={opt.value === undefined ? '' : String(opt.value)}
                        >
                          {String(t(`steps.customize.duration_options.${opt.i18nKey}`))}
                        </option>
                      ))}
                    </DurationSelect>
                  )}
                </Layout.FlexRow>
              );
            })}
            {!tabsValid && (
              <Typo type="label-small" color="MEDIUM_GRAY">
                {t('steps.customize.errors.tabs_required')}
              </Typo>
            )}
          </Layout.FlexCol>

          {/* Apply these filters */}
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="title-small">{t('steps.customize.filters_section')}</Typo>
            {FILTER_KEYS.map((key) => (
              <ToggleRow
                key={key}
                label={String(t(`filters.${key}`))}
                checked={!!config.filters[key]}
                onToggle={() => toggleFilter(key)}
              />
            ))}
          </Layout.FlexCol>

          {/* Default battery (optional) — when set, the "Also set my battery"
              sync toggle on the mode picker will apply this battery on activation. */}
          <Layout.FlexCol w="100%" gap={6}>
            <Typo type="title-small">{t('steps.customize.battery_section')}</Typo>
            <Typo type="body-small" color="MEDIUM_GRAY">
              {t('steps.customize.battery_subtitle')}
            </Typo>
            <Layout.FlexRow gap={6} pt={4} style={{ flexWrap: 'wrap' }}>
              <NoneChip
                type="button"
                $active={defaultBattery === null}
                onClick={() => setDefaultBattery(null)}
              >
                <Typo
                  type="label-large"
                  color={defaultBattery === null ? 'PRIMARY' : 'MEDIUM_GRAY'}
                >
                  {t('steps.customize.battery_none')}
                </Typo>
              </NoneChip>
              {Object.values(SocialBattery).map((battery) => (
                <SocialBatteryChip
                  key={battery}
                  socialBattery={battery}
                  onSelect={() => setDefaultBattery(battery)}
                  isSelected={defaultBattery === battery}
                />
              ))}
            </Layout.FlexRow>
          </Layout.FlexCol>

          {/* Save section — name input is always visible so the path to a saved
              mode is one continuous form, not a hidden two-step. "Apply without
              saving" stays as the no-name escape hatch.
              The label/input/counter use a small inline-form style instead of
              the design-system Input (which is sized for prominent login-style
              forms and visually overpowers this multi-section sheet). */}
          <Layout.FlexCol w="100%" gap={12}>
            <Layout.FlexCol w="100%" gap={4}>
              <Typo type="title-small" color="MEDIUM_GRAY">
                {t('steps.customize.name_label')}
              </Typo>
              <NameInput
                type="text"
                placeholder={String(t('steps.customize.name_placeholder'))}
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                autoCapitalize="none"
                autoComplete="off"
              />
              <Layout.FlexRow w="100%" justifyContent="flex-end">
                <Typo type="label-small" color="DARK_GRAY">
                  {name.length} / 40
                </Typo>
              </Layout.FlexRow>

              {/* Optional one-line description shown under the name on the
                  picker card. Backend caps at 30 — short on purpose so the
                  card doesn't grow unpredictably when the description has to
                  share a row with the chevron / X. */}
              <Typo type="title-small" color="MEDIUM_GRAY">
                {t('steps.customize.description_label')}
              </Typo>
              <NameInput
                type="text"
                placeholder={String(t('steps.customize.description_placeholder'))}
                value={description}
                maxLength={30}
                onChange={(e) => setDescription(e.target.value)}
                autoCapitalize="none"
                autoComplete="off"
              />
              <Layout.FlexRow w="100%" justifyContent="flex-end">
                <Typo type="label-small" color="DARK_GRAY">
                  {description.length} / 30
                </Typo>
              </Layout.FlexRow>

              {error && (
                <Typo type="label-small" color="WARNING">
                  {error}
                </Typo>
              )}
            </Layout.FlexCol>
            {/* Save is enabled as soon as tabs are valid — name can be blank
                because we auto-slug from tab choices in handleSave. */}
            <BottomModalActionButton
              status={tabsValid && !saving ? 'normal' : 'disabled'}
              text={t('steps.customize.save')}
              onClick={handleSave}
            />
            <ApplyWithoutSavingLink
              type="button"
              onClick={() =>
                tabsValid &&
                onApplyWithoutSaving({
                  config,
                  name,
                  description,
                  default_battery: defaultBattery,
                })
              }
              disabled={!tabsValid}
            >
              <Typo type="label-large" color={tabsValid ? 'PRIMARY' : 'LIGHT_GRAY'}>
                {t('steps.customize.apply_without_saving')}
              </Typo>
            </ApplyWithoutSavingLink>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>,
    document.body,
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, checked, onToggle }: ToggleRowProps) {
  return (
    <ToggleButton type="button" onClick={onToggle} aria-pressed={checked}>
      <CheckSquare $checked={checked} />
      <Typo type="body-medium">{label}</Typo>
    </ToggleButton>
  );
}

export default BrowseModeCustomizeSheet;

const TemplateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: ${Colors.WHITE};
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  text-align: left;
  &:hover {
    border-color: ${Colors.PRIMARY};
  }
`;

const TemplateEmoji = styled.span`
  font-size: 22px;
  line-height: 1;
`;

const TabPill = styled.button<{ $active: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  border: 1px solid ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  background: ${({ $active }) => ($active ? '#F3E8FF' : Colors.WHITE)};
  cursor: pointer;
  /* Pill is the wider element on the left; let it shrink before the
     duration select if both can't fit. Min-width keeps the label readable. */
  flex-shrink: 0;
  min-width: 80px;
  text-align: left;
`;

// iOS-Focus-mode-style time picker. Uses the native <select> so iOS gives
// the system wheel UI and Android the dropdown — same UX users already
// know from Focus / Do Not Disturb settings.
const DurationSelect = styled.select`
  border-radius: 8px;
  padding: 4px 8px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  background: ${Colors.WHITE};
  font-size: 14px;
  font-family: inherit;
  color: ${Colors.DARK_GRAY};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${Colors.PRIMARY};
  }
`;

const NoneChip = styled.button<{ $active: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  border: 1px solid ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  background: ${({ $active }) => ($active ? '#F3E8FF' : Colors.WHITE)};
  cursor: pointer;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  width: 100%;
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

const ApplyWithoutSavingLink = styled.button`
  background: none;
  border: none;
  padding: 8px 0;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  align-self: center;
`;

// Inline-form input. Same look as the design-system Input (underline that
// thickens + tints PRIMARY on focus) but with tighter vertical padding so
// the field doesn't dwarf the surrounding 14px body text on this sheet.
const NameInput = styled.input`
  width: 100%;
  outline: none;
  padding: 6px 0;
  font-size: 14px;
  font-family: inherit;
  border-width: 0 0 1px;
  border-color: ${Colors.MEDIUM_GRAY};
  &:focus {
    border-bottom-width: 2px;
    border-bottom-color: ${Colors.PRIMARY};
    padding-bottom: 5px;
  }
  &::placeholder {
    color: ${Colors.MEDIUM_GRAY};
  }
`;
