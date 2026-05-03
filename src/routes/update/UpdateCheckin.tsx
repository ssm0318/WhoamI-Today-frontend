import { Track } from '@spotify/web-api-ts-sdk';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { mutate as globalMutate } from 'swr';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import ArchiveEntryMoreModal from '@components/check-in/archive/ArchiveEntryMoreModal';
import ModifyVisibilityModal from '@components/check-in/archive/ModifyVisibilityModal';
import PinConfirmModal from '@components/check-in/archive/PinConfirmModal';
import ThoughtFullTextModal from '@components/check-in/archive/ThoughtFullTextModal';
import MoodGrid from '@components/check-in/mood-grid/MoodGrid';
import BatteryEditor from '@components/check-in/update-quadrant/BatteryEditor';
import MoodEditor from '@components/check-in/update-quadrant/MoodEditor';
import SongEditor from '@components/check-in/update-quadrant/SongEditor';
import ThoughtEditor from '@components/check-in/update-quadrant/ThoughtEditor';
import { getVisibilityLabel } from '@components/check-in/visibility-toggle/VisibilityToggle';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useArchiveCounts } from '@hooks/useArchiveCounts';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import SpotifyManager from '@libs/SpotifyManager';
import { ComponentVisibility, DEFAULT_VISIBILITY, SocialBattery } from '@models/checkIn';
import { CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import { useBoundStore } from '@stores/useBoundStore';
import {
  archiveEntriesFetcher,
  ArchiveEntriesResponse,
  deleteArchiveEntry,
  togglePin,
  updatePinVisibility,
} from '@utils/apis/archive';
import { deactivateSong, getActiveSong, postCheckIn, postSong } from '@utils/apis/checkIn';
import { groupEntriesByDate } from '@utils/archiveHelpers';
import { MainScrollContainer } from '../Root';
import {
  GridContainer,
  HistoryDescription,
  QuadrantCard,
  QuadrantLabel,
  VisibilityBadge,
} from './UpdateCheckin.styled';

type EditorTarget = 'battery' | 'mood' | 'song' | 'thought' | null;
type MainTab = 'current' | 'pinned' | 'history';

export default function UpdateCheckin() {
  const [t] = useTranslation('translation', { keyPrefix: 'social_battery' });
  const [tHistory] = useTranslation('translation', { keyPrefix: 'history' });

  const { fetchCheckIn } = useBoundStore((state) => ({
    fetchCheckIn: state.fetchCheckIn,
  }));

  const sendMessage = usePostAppMessage();
  const openToast = useBoundStore((state) => state.openToast);

  // ── Main tab state ──────────────────────────────────────────────
  const [mainTab, setMainTab] = useState<MainTab>('current');
  const { historyCount, pinnedCount } = useArchiveCounts();

  // ── Current tab: editor state ───────────────────────────────────
  const [activeEditor, setActiveEditor] = useState<EditorTarget>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [initialTrackId, setInitialTrackId] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const hasAutoOpenedRef = useRef(false);
  useEffect(() => {
    if (!isDataLoaded || hasAutoOpenedRef.current) return;
    const editorParam = searchParams.get('editor');
    if (editorParam && ['battery', 'mood', 'song', 'thought'].includes(editorParam)) {
      setActiveEditor(editorParam as EditorTarget);
      hasAutoOpenedRef.current = true;
      const next = new URLSearchParams(searchParams);
      next.delete('editor');
      setSearchParams(next, { replace: true });
    }
  }, [isDataLoaded, searchParams, setSearchParams]);

  const [battery, setBattery] = useState<SocialBattery | null>(null);
  const [mood, setMood] = useState<string[]>([]);
  const [trackId, setTrackId] = useState('');
  const [thought, setThought] = useState('');

  const [visibility, setVisibility] = useState<string[]>(['public']);
  const [batteryVis, setBatteryVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.battery);
  const [moodVis, setMoodVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.mood);
  const [songVis, setSongVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.song);
  const [thoughtVis, setThoughtVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.thought);

  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  useEffect(() => {
    if (!trackId) {
      setTrackData(null);
      return;
    }
    spotifyManager
      .getTrack(trackId)
      .then(setTrackData)
      .catch(() => setTrackData(null));
  }, [trackId, spotifyManager]);

  useAsyncEffect(async () => {
    const [ci, activeSong] = await Promise.all([fetchCheckIn(), getActiveSong()]);
    if (ci) {
      setBattery(ci.social_battery || null);
      setMood(Array.isArray(ci.mood) ? ci.mood : ci.mood ? [ci.mood] : []);
      setThought(ci.thought || '');
      if (ci.visibility) setVisibility(ci.visibility);
      if (ci.battery_visibility) setBatteryVis(ci.battery_visibility);
      if (ci.mood_visibility) setMoodVis(ci.mood_visibility);
      if (ci.song_visibility) setSongVis(ci.song_visibility);
      if (ci.thought_visibility) setThoughtVis(ci.thought_visibility);
    }
    if (activeSong) {
      setTrackId(activeSong.track_id || '');
      setInitialTrackId(activeSong.track_id || '');
    }
    setIsDataLoaded(true);
  }, []);

  const stateRef = useRef({
    battery,
    mood,
    thought,
    trackId,
    visibility,
    batteryVis,
    moodVis,
    songVis,
    thoughtVis,
  });
  stateRef.current = {
    battery,
    mood,
    thought,
    trackId,
    visibility,
    batteryVis,
    moodVis,
    songVis,
    thoughtVis,
  };

  const doSave = useCallback(async () => {
    const s = stateRef.current;
    try {
      const checkInPromise = postCheckIn({
        social_battery: s.battery,
        mood: s.mood,
        thought: s.thought,
        track_id: '',
        visibility: s.visibility || ['public'],
        battery_visibility: s.batteryVis,
        mood_visibility: s.moodVis,
        song_visibility: s.songVis,
        thought_visibility: s.thoughtVis,
      });
      const songPromise =
        s.trackId && s.trackId !== initialTrackId ? postSong(s.trackId) : Promise.resolve();
      await Promise.all([checkInPromise, songPromise]);

      if (window.ReactNativeWebView) {
        sendMessage('WIDGET_DATA_UPDATED', {
          check_in: {
            id: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            mood: s.mood,
            social_battery: s.battery,
            description: s.thought,
            track_id: s.trackId,
          },
        });
      }
      await fetchCheckIn();
      openToast({ message: 'Shared!' });
    } catch {
      openToast({ message: 'Failed to save' });
    }
  }, [fetchCheckIn, sendMessage, openToast, initialTrackId]);

  const handleEditorDismiss = useCallback(() => setActiveEditor(null), []);

  const handleThoughtShare = useCallback(
    (nextThought: string, nextThoughtVis: ComponentVisibility) => {
      setThought(nextThought);
      setThoughtVis(nextThoughtVis);
      setActiveEditor(null);
      requestAnimationFrame(() => {
        stateRef.current = {
          ...stateRef.current,
          thought: nextThought,
          thoughtVis: nextThoughtVis,
        };
        doSave();
      });
    },
    [doSave],
  );

  const handleBatteryShare = useCallback(
    (nextBattery: SocialBattery | null, nextBatteryVis: ComponentVisibility) => {
      setBattery(nextBattery);
      setBatteryVis(nextBatteryVis);
      setActiveEditor(null);
      requestAnimationFrame(() => {
        stateRef.current = {
          ...stateRef.current,
          battery: nextBattery,
          batteryVis: nextBatteryVis,
        };
        doSave();
      });
    },
    [doSave],
  );

  const handleMoodShare = useCallback(
    (nextMood: string[], nextMoodVis: ComponentVisibility) => {
      setMood(nextMood);
      setMoodVis(nextMoodVis);
      setActiveEditor(null);
      requestAnimationFrame(() => {
        stateRef.current = { ...stateRef.current, mood: nextMood, moodVis: nextMoodVis };
        doSave();
      });
    },
    [doSave],
  );

  const handleSongShare = useCallback(
    async (nextTrackId: string, nextSongVis: ComponentVisibility) => {
      setActiveEditor(null);
      const wasActive = !!stateRef.current.trackId;
      if (!nextTrackId && wasActive) {
        try {
          const active = await getActiveSong();
          if (active) await deactivateSong(active.id);
          setTrackId('');
          setSongVis(nextSongVis);
          stateRef.current = { ...stateRef.current, trackId: '', songVis: nextSongVis };
          await fetchCheckIn();
          openToast({ message: 'Removed' });
        } catch {
          openToast({ message: 'Failed to remove' });
        }
        return;
      }
      setTrackId(nextTrackId);
      setSongVis(nextSongVis);
      requestAnimationFrame(() => {
        stateRef.current = { ...stateRef.current, trackId: nextTrackId, songVis: nextSongVis };
        doSave();
      });
    },
    [doSave, fetchCheckIn, openToast],
  );

  // ── Archive tabs: Pinned / History ──────────────────────────────
  const archiveTab = mainTab === 'pinned' ? 'pinned' : 'all';
  const baseKey =
    mainTab !== 'current'
      ? `/check_in/entries/${archiveTab === 'pinned' ? '?tab=pinned' : ''}`
      : null;

  const { data, isLoading, isLoadingMore, targetRef, isEndPage, mutate } = useSWRInfiniteCursor<
    CheckInComponentEntry,
    ArchiveEntriesResponse
  >({
    baseKey,
    fetcher: archiveEntriesFetcher,
  });

  const flat = useMemo<CheckInComponentEntry[]>(
    () => (data ? data.flatMap((page) => page.results ?? []) : []),
    [data],
  );
  const sections = useMemo(() => groupEntriesByDate(flat), [flat]);

  const [thoughtModalEntry, setThoughtModalEntry] = useState<CheckInComponentEntry | null>(null);
  const [moreEntry, setMoreEntry] = useState<CheckInComponentEntry | null>(null);
  const [visibilityEntry, setVisibilityEntry] = useState<CheckInComponentEntry | null>(null);
  const [pinConfirmEntry, setPinConfirmEntry] = useState<CheckInComponentEntry | null>(null);

  const invalidateSiblingCaches = useCallback(() => {
    globalMutate('/check_in/entries/');
  }, []);

  const handlePinClick = (entry: CheckInComponentEntry) => {
    if (entry.is_pinned) handleUnpin(entry);
    else setPinConfirmEntry(entry);
  };

  const handleUnpin = async (entry: CheckInComponentEntry) => {
    await mutate(
      async (pages) => {
        try {
          const updated = await togglePin(entry.id);
          return patchEntryInPages(pages, updated);
        } catch {
          openToast({ message: tHistory('pin.error') });
          throw new Error('unpin failed');
        }
      },
      {
        optimisticData: (pages) =>
          patchEntryInPages(pages, { ...entry, is_pinned: false, pin_visibility: null }),
        rollbackOnError: true,
        revalidate: true,
      },
    ).catch(() => {});
    openToast({ message: tHistory('pin.unpinned') });
    invalidateSiblingCaches();
  };

  const handlePinConfirm = async (entry: CheckInComponentEntry, vis: ComponentVisibility) => {
    await mutate(
      async (pages) => {
        try {
          const updated = await togglePin(entry.id, vis);
          return patchEntryInPages(pages, updated);
        } catch {
          openToast({ message: tHistory('pin.error') });
          throw new Error('pin failed');
        }
      },
      {
        optimisticData: (pages) =>
          patchEntryInPages(pages, { ...entry, is_pinned: true, pin_visibility: vis }),
        rollbackOnError: true,
        revalidate: true,
      },
    ).catch(() => {});
    openToast({ message: tHistory('pin.pinned') });
    invalidateSiblingCaches();
  };

  const handleModifyVisibility = async (entry: CheckInComponentEntry) => {
    if (entry.is_pinned) {
      setVisibilityEntry(entry);
      return;
    }
    try {
      const updated = await togglePin(entry.id);
      await mutate((pages) => patchEntryInPages(pages, updated), { revalidate: false });
      invalidateSiblingCaches();
      setVisibilityEntry(updated);
    } catch {
      openToast({ message: tHistory('pin.error') });
    }
  };

  const handleConfirmVisibility = async (vis: ComponentVisibility) => {
    if (!visibilityEntry) return;
    try {
      const updated = await updatePinVisibility(visibilityEntry.id, vis);
      await mutate((pages) => patchEntryInPages(pages, updated), { revalidate: false });
      openToast({ message: tHistory('visibility_modal.updated_toast') });
      invalidateSiblingCaches();
    } catch {
      openToast({ message: tHistory('visibility_modal.error') });
    }
    setVisibilityEntry(null);
  };

  const handleDelete = async (entry: CheckInComponentEntry) => {
    try {
      await deleteArchiveEntry(entry.id);
      await mutate();
      openToast({ message: tHistory('delete_confirm.toast_deleted') });
      invalidateSiblingCaches();
    } catch {
      openToast({ message: tHistory('delete_confirm.error') });
    }
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <MainScrollContainer>
      {/* Tab bar */}
      <Layout.FlexRow
        w="100%"
        gap={6}
        alignItems="center"
        style={{ padding: '10px 12px 0', justifyContent: 'flex-start' }}
      >
        <TabButton active={mainTab === 'current'} onClick={() => setMainTab('current')}>
          <SvgIcon name="edit" size={16} color={mainTab === 'current' ? 'WHITE' : 'PRIMARY'} />
          Current
        </TabButton>
        <TabButton active={mainTab === 'pinned'} onClick={() => setMainTab('pinned')}>
          <SvgIcon name="pin_filled" size={13} color={mainTab === 'pinned' ? 'WHITE' : 'PRIMARY'} />
          {tHistory('segmented.pinned')} ({pinnedCount})
        </TabButton>
        <TabButton active={mainTab === 'history'} onClick={() => setMainTab('history')}>
          <HistoryIcon active={mainTab === 'history'} />
          {tHistory('segmented.all')} ({historyCount})
        </TabButton>
      </Layout.FlexRow>

      {/* Current tab */}
      {mainTab === 'current' && (
        <>
          <HistoryDescription>{tHistory('checkin_tab_hint')}</HistoryDescription>
          <GridContainer>
            {/* Top-Left: Social Battery */}
            <QuadrantCard $isEmpty={!battery} onClick={() => setActiveEditor('battery')}>
              {battery ? <VisibilityBadge>{getVisibilityLabel(batteryVis)}</VisibilityBadge> : null}
              {battery ? (
                <Layout.FlexCol alignItems="center" gap={6}>
                  <EmojiItem
                    emojiString={SocialBatteryChipAssets[battery]?.emoji || ''}
                    size={40}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                  <Typo type="body-medium" numberOfLines={1} textAlign="center">
                    {t(battery)}
                  </Typo>
                  <Typo type="body-medium" color="MEDIUM_GRAY" numberOfLines={1} textAlign="center">
                    Social Battery
                  </Typo>
                </Layout.FlexCol>
              ) : (
                <>
                  <SvgIcon name="add_battery" size={32} />
                  <QuadrantLabel>Social Battery</QuadrantLabel>
                </>
              )}
            </QuadrantCard>

            {/* Top-Right: Mood */}
            <QuadrantCard $isEmpty={mood.length === 0} onClick={() => setActiveEditor('mood')}>
              {mood.length > 0 ? (
                <VisibilityBadge>{getVisibilityLabel(moodVis)}</VisibilityBadge>
              ) : null}
              {mood.length > 0 ? (
                <>
                  <MoodGrid mood={mood} size={32} gap={8} rowGap={4} />
                  <QuadrantLabel>Mood</QuadrantLabel>
                </>
              ) : (
                <>
                  <SvgIcon name="add_reaction_default" size={32} />
                  <QuadrantLabel>Mood</QuadrantLabel>
                </>
              )}
            </QuadrantCard>

            {/* Bottom-Left: Song */}
            <QuadrantCard $isEmpty={!trackId} onClick={() => setActiveEditor('song')}>
              {trackId ? <VisibilityBadge>{getVisibilityLabel(songVis)}</VisibilityBadge> : null}
              {trackId && trackData ? (
                <Layout.FlexCol w="100%" alignItems="center" gap={6}>
                  {trackData.album?.images?.[0]?.url && (
                    <img
                      src={trackData.album.images[0].url}
                      alt="album"
                      style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                    />
                  )}
                  <Typo type="body-medium" numberOfLines={1} textAlign="center">
                    {trackData.name}
                  </Typo>
                  <Typo type="body-medium" color="MEDIUM_GRAY" numberOfLines={1} textAlign="center">
                    {trackData.artists?.[0]?.name || ''}
                  </Typo>
                </Layout.FlexCol>
              ) : (
                <>
                  <SvgIcon name="spotify" size={32} />
                  <QuadrantLabel>Song</QuadrantLabel>
                </>
              )}
            </QuadrantCard>

            {/* Bottom-Right: Thought Snippet */}
            <QuadrantCard $isEmpty={!thought} onClick={() => setActiveEditor('thought')}>
              {thought ? <VisibilityBadge>{getVisibilityLabel(thoughtVis)}</VisibilityBadge> : null}
              {thought ? (
                <Layout.FlexCol w="100%" alignItems="center" gap={4} ph={4}>
                  <Typo type="body-medium" textAlign="center">
                    {thought}
                  </Typo>
                  <QuadrantLabel>Be Random</QuadrantLabel>
                </Layout.FlexCol>
              ) : (
                <>
                  <SvgIcon name="edit" size={32} />
                  <QuadrantLabel>Be Random</QuadrantLabel>
                </>
              )}
            </QuadrantCard>
          </GridContainer>

          {/* Editor Popups */}
          <BatteryEditor
            isOpen={activeEditor === 'battery'}
            onClose={handleEditorDismiss}
            onShare={handleBatteryShare}
            value={battery}
            onChange={setBattery}
            visibility={batteryVis}
            onVisibilityChange={setBatteryVis}
          />
          <MoodEditor
            isOpen={activeEditor === 'mood'}
            onClose={handleEditorDismiss}
            onShare={handleMoodShare}
            value={mood}
            onChange={setMood}
            visibility={moodVis}
            onVisibilityChange={setMoodVis}
          />
          <SongEditor
            isOpen={activeEditor === 'song'}
            onClose={handleEditorDismiss}
            onShare={handleSongShare}
            trackId={trackId}
            onChange={setTrackId}
            visibility={songVis}
            onVisibilityChange={setSongVis}
          />
          <ThoughtEditor
            isOpen={activeEditor === 'thought'}
            onClose={handleEditorDismiss}
            onShare={handleThoughtShare}
            value={thought}
            onChange={setThought}
            visibility={thoughtVis}
            onVisibilityChange={setThoughtVis}
          />
        </>
      )}

      {/* Pinned / History tabs */}
      {mainTab !== 'current' && (
        <Layout.FlexCol w="100%" ph={12} style={{ paddingBottom: 80 }}>
          {mainTab === 'history' && (
            <Layout.FlexRow w="100%" mt={16} mb={8}>
              <Typo type="body-small" color="DARK_GRAY">
                {tHistory('history_hint')}
              </Typo>
            </Layout.FlexRow>
          )}

          {sections.map((section) => (
            <ArchiveDateSection
              key={section.key}
              label={section.label}
              items={section.items}
              onPinClick={handlePinClick}
              onMoreClick={(entry) => setMoreEntry(entry)}
              onBodyClick={(entry) => {
                if (entry.component === ComponentType.THOUGHT) setThoughtModalEntry(entry);
              }}
            />
          ))}
          <div ref={targetRef} />
          {(isLoading || isLoadingMore) && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
          {!isLoading && flat.length === 0 && (
            <NoContents
              text={mainTab === 'pinned' ? tHistory('empty.pinned') : tHistory('empty.all')}
              mv={20}
            />
          )}
          {isEndPage && flat.length > 0 && (
            <Layout.FlexRow w="100%" justifyContent="center" mt={8}>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {tHistory('end_of_feed')}
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      )}

      {/* Archive modals (active regardless of tab so they can close gracefully) */}
      <ThoughtFullTextModal entry={thoughtModalEntry} onClose={() => setThoughtModalEntry(null)} />
      <ArchiveEntryMoreModal
        entry={moreEntry}
        onClose={() => setMoreEntry(null)}
        onModifyVisibility={handleModifyVisibility}
        onDelete={handleDelete}
      />
      <ModifyVisibilityModal
        entry={visibilityEntry}
        onClose={() => setVisibilityEntry(null)}
        onConfirm={handleConfirmVisibility}
      />
      <PinConfirmModal
        entry={pinConfirmEntry}
        onClose={() => setPinConfirmEntry(null)}
        onConfirm={handlePinConfirm}
      />
    </MainScrollContainer>
  );
}

// ── helpers ────────────────────────────────────────────────────────

function patchEntryInPages(
  pages: ArchiveEntriesResponse[] | undefined,
  patched: CheckInComponentEntry,
): ArchiveEntriesResponse[] {
  if (!pages) return [];
  return pages.map((page) => ({
    ...page,
    results: (page.results ?? []).map((e) => (e.id === patched.id ? patched : e)),
  }));
}

// ── local UI primitives ────────────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 999,
        padding: '5px 13px',
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        border: 'none',
        background: active ? Colors.DARK : '#F0F0F0',
        color: active ? Colors.WHITE : Colors.PRIMARY,
        cursor: 'pointer',
        flexShrink: 0,
        lineHeight: 1.4,
      }}
    >
      {children}
    </button>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: active ? Colors.WHITE : Colors.PRIMARY }}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
