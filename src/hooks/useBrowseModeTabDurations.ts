import { useEffect } from 'react';
import { BrowseModeTabKey } from '@models/browseMode';
import { useBoundStore } from '@stores/useBoundStore';

const STORAGE_KEY_PREFIX = 'browse_mode_tab_durations_started_at_';

function key(userId: number, modeKey: string) {
  return `${STORAGE_KEY_PREFIX}${userId}_${modeKey}`;
}

/**
 * Per-tab "auto-fade" timers — Apple-Focus-mode style.
 *
 * For each tab in the active mode that has a `tab_durations[tab]` minute
 * value, schedule a one-shot timer; when it fires, that tab is removed
 * from `activeBrowseMode.config.tabs`. Tabs without a duration entry stay
 * forever.
 *
 * Activation timestamp is persisted per-user/per-mode in localStorage so
 * the timers survive reloads. Switching to a different mode clears the
 * persisted timestamp so the next activation starts fresh.
 *
 * Implementation note: a single shared timestamp is the source of truth.
 * Each tab's deadline = timestamp + its duration. We don't track per-tab
 * timestamps — they all start when the user activates the mode.
 */
export function useBrowseModeTabDurations() {
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const userId = useBoundStore((state) => state.myProfile?.id);

  // Combine kind+id so built-in 'very_social' and a hypothetical custom id
  // 'very_social' don't collide in storage (also custom id 1 vs the string
  // 'very_social' built-in).
  const modeKey = activeBrowseMode ? `${activeBrowseMode.kind}:${activeBrowseMode.id}` : null;
  // Stable JSON for the deps array — passing the object directly would
  // re-fire the effect every render (object identity changes).
  const durationsJson = JSON.stringify(activeBrowseMode?.config.tab_durations ?? {});

  useEffect(() => {
    if (!userId || !modeKey) return undefined;
    const durations = JSON.parse(durationsJson) as Partial<Record<BrowseModeTabKey, number>>;
    type DurationEntry = [BrowseModeTabKey, number];
    const entries = Object.entries(durations).filter(
      ([, m]) => typeof m === 'number' && m > 0,
    ) as DurationEntry[];
    if (entries.length === 0) return undefined;

    const storageKey = key(userId, modeKey);
    const existing = localStorage.getItem(storageKey);
    const now = Date.now();
    const startedAt = existing ? Number(existing) : now;
    if (!existing) localStorage.setItem(storageKey, String(now));

    const timers: number[] = [];

    const removeTab = (tab: BrowseModeTabKey) => {
      // Always re-read state at fire time — the user could have toggled
      // the tab off in the customize sheet between schedule and fire.
      const current = useBoundStore.getState().activeBrowseMode;
      if (!current) return;
      if (`${current.kind}:${current.id}` !== modeKey) return;
      if (!current.config.tabs.includes(tab)) return;
      useBoundStore.setState({
        activeBrowseMode: {
          ...current,
          config: { ...current.config, tabs: current.config.tabs.filter((x) => x !== tab) },
        },
      });
    };

    entries.forEach(([tab, minutes]) => {
      const deadline = startedAt + minutes * 60 * 1000;
      const remainingMs = deadline - now;
      if (remainingMs <= 0) {
        removeTab(tab);
        return;
      }
      timers.push(window.setTimeout(() => removeTab(tab), remainingMs));
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
    // We deliberately don't depend on the full activeBrowseMode object —
    // re-running on every config edit would reset all timers. modeKey
    // (kind:id) is the right granularity: timers reset on mode switch only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeKey, durationsJson, userId]);

  // Clear the persisted timestamp when the user actually switches to a
  // different mode. Using cleanup on modeKey-keyed effect.
  useEffect(() => {
    return () => {
      if (!userId || !modeKey) return;
      const next = useBoundStore.getState().activeBrowseMode;
      const stillSame = next && `${next.kind}:${next.id}` === modeKey;
      if (!stillSame) {
        localStorage.removeItem(key(userId, modeKey));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeKey]);
}
