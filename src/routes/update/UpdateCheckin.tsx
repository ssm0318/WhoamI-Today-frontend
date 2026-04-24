import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import BatteryEditor from '@components/check-in/update-quadrant/BatteryEditor';
import MoodEditor from '@components/check-in/update-quadrant/MoodEditor';
import SongEditor from '@components/check-in/update-quadrant/SongEditor';
import ThoughtEditor from '@components/check-in/update-quadrant/ThoughtEditor';
import { getVisibilityLabel } from '@components/check-in/visibility-toggle/VisibilityToggle';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { ComponentVisibility, DEFAULT_VISIBILITY, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { getActiveSong, postCheckIn, postSong } from '@utils/apis/checkIn';
import { MainScrollContainer } from '../Root';
import {
  ArchivedBadge,
  ArchiveDescription,
  GridContainer,
  QuadrantCard,
  QuadrantLabel,
  VisibilityBadge,
} from './UpdateCheckin.styled';

type EditorTarget = 'battery' | 'mood' | 'song' | 'thought' | null;

const ARCHIVE_THRESHOLD_MS = 12 * 60 * 60 * 1000;

function isArchived(updatedAt?: string): boolean {
  if (!updatedAt) return false;
  return Date.now() - new Date(updatedAt).getTime() > ARCHIVE_THRESHOLD_MS;
}

export default function UpdateCheckin() {
  const [t] = useTranslation('translation', { keyPrefix: 'social_battery' });

  const { checkIn, fetchCheckIn } = useBoundStore((state) => ({
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const sendMessage = usePostAppMessage();
  const openToast = useBoundStore((state) => state.openToast);

  const [activeEditor, setActiveEditor] = useState<EditorTarget>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Auto-open editor popup from deep link query param (e.g. /update?editor=mood).
  // Gated on isDataLoaded so that editor captures current values, not initial empty defaults.
  // Param is stripped from URL after opening so that a later reload doesn't re-trigger.
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

  // Track data for song quadrant display
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
    }
    setIsDataLoaded(true);
  }, []);

  const batteryArchived = useMemo(
    () => !!battery && isArchived(checkIn?.battery_updated_at),
    [battery, checkIn?.battery_updated_at],
  );
  const moodArchived = useMemo(
    () => mood.length > 0 && isArchived(checkIn?.mood_updated_at),
    [mood, checkIn?.mood_updated_at],
  );
  const songArchived = useMemo(
    () => !!trackId && isArchived(checkIn?.song_updated_at),
    [trackId, checkIn?.song_updated_at],
  );
  const thoughtArchived = useMemo(
    () => !!thought && isArchived(checkIn?.thought_updated_at),
    [thought, checkIn?.thought_updated_at],
  );

  const effectiveBatteryVis = batteryArchived ? ComponentVisibility.ONLY_ME : batteryVis;
  const effectiveMoodVis = moodArchived ? ComponentVisibility.ONLY_ME : moodVis;
  const effectiveSongVis = songArchived ? ComponentVisibility.ONLY_ME : songVis;
  const effectiveThoughtVis = thoughtArchived ? ComponentVisibility.ONLY_ME : thoughtVis;

  // Refs to always have latest values for saving (avoids stale closure issues)
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
    console.log('[UpdateCheckin] doSave start', {
      battery: s.battery,
      moodCount: s.mood.length,
      thoughtLength: s.thought.length,
      trackId: s.trackId,
    });
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
      const songPromise = s.trackId ? postSong(s.trackId) : Promise.resolve();
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
      console.log('[UpdateCheckin] doSave success');
      openToast({ message: 'Shared!' });
    } catch {
      console.log('[UpdateCheckin] doSave failed');
      openToast({ message: 'Failed to save' });
    }
  }, [fetchCheckIn, sendMessage, openToast]);

  const handleEditorDismiss = useCallback(() => {
    console.log('[UpdateCheckin] handleEditorDismiss');
    setActiveEditor(null);
  }, []);

  const handleThoughtShare = useCallback(
    (nextThought: string, nextThoughtVis: ComponentVisibility) => {
      console.log('[UpdateCheckin] handleThoughtShare', {
        nextThoughtLength: nextThought.length,
        nextThoughtVis,
      });
      // Commit these first so save reads the latest values.
      setThought(nextThought);
      setThoughtVis(nextThoughtVis);
      setActiveEditor(null);
      requestAnimationFrame(() => {
        const s = stateRef.current;
        stateRef.current = {
          ...s,
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
        const s = stateRef.current;
        stateRef.current = {
          ...s,
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
        const s = stateRef.current;
        stateRef.current = {
          ...s,
          mood: nextMood,
          moodVis: nextMoodVis,
        };
        doSave();
      });
    },
    [doSave],
  );

  const handleSongShare = useCallback(
    (nextTrackId: string, nextSongVis: ComponentVisibility) => {
      setTrackId(nextTrackId);
      setSongVis(nextSongVis);
      setActiveEditor(null);
      requestAnimationFrame(() => {
        const s = stateRef.current;
        stateRef.current = {
          ...s,
          trackId: nextTrackId,
          songVis: nextSongVis,
        };
        doSave();
      });
    },
    [doSave],
  );

  return (
    <MainScrollContainer>
      <GridContainer>
        {/* Top-Left: Social Battery */}
        <QuadrantCard
          $isEmpty={!battery}
          $isArchived={batteryArchived}
          onClick={() => setActiveEditor('battery')}
        >
          {battery ? (
            batteryArchived ? (
              <ArchivedBadge>Only Me (Archived)</ArchivedBadge>
            ) : (
              <VisibilityBadge>{getVisibilityLabel(batteryVis)}</VisibilityBadge>
            )
          ) : null}
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
        <QuadrantCard
          $isEmpty={mood.length === 0}
          $isArchived={moodArchived}
          onClick={() => setActiveEditor('mood')}
        >
          {mood.length > 0 ? (
            moodArchived ? (
              <ArchivedBadge>Only Me (Archived)</ArchivedBadge>
            ) : (
              <VisibilityBadge>{getVisibilityLabel(moodVis)}</VisibilityBadge>
            )
          ) : null}
          {mood.length > 0 ? (
            <>
              <Layout.FlexRow gap={4} alignItems="center">
                {mood.map((emoji) => (
                  <span key={emoji} style={{ fontSize: 32, lineHeight: 1 }}>
                    {emoji}
                  </span>
                ))}
              </Layout.FlexRow>
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
        <QuadrantCard
          $isEmpty={!trackId}
          $isArchived={songArchived}
          onClick={() => setActiveEditor('song')}
        >
          {trackId ? (
            songArchived ? (
              <ArchivedBadge>Only Me (Archived)</ArchivedBadge>
            ) : (
              <VisibilityBadge>{getVisibilityLabel(songVis)}</VisibilityBadge>
            )
          ) : null}
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
        <QuadrantCard
          $isEmpty={!thought}
          $isArchived={thoughtArchived}
          onClick={() => setActiveEditor('thought')}
        >
          {thought ? (
            thoughtArchived ? (
              <ArchivedBadge>Only Me (Archived)</ArchivedBadge>
            ) : (
              <VisibilityBadge>{getVisibilityLabel(thoughtVis)}</VisibilityBadge>
            )
          ) : null}
          {thought ? (
            <Layout.FlexCol w="100%" alignItems="center" gap={4} ph={4}>
              <Typo type="body-medium" numberOfLines={3} textAlign="center">
                {thought}
              </Typo>
              <QuadrantLabel>Thought Snippet</QuadrantLabel>
            </Layout.FlexCol>
          ) : (
            <>
              <SvgIcon name="edit" size={32} />
              <QuadrantLabel>Thought Snippet</QuadrantLabel>
            </>
          )}
        </QuadrantCard>
      </GridContainer>

      <ArchiveDescription>
        Items automatically archive after 12 hours and become visible only to you.
      </ArchiveDescription>

      {/* Editor Popups — "Share" auto-saves */}
      <BatteryEditor
        isOpen={activeEditor === 'battery'}
        onClose={handleEditorDismiss}
        onShare={handleBatteryShare}
        value={battery}
        onChange={setBattery}
        visibility={effectiveBatteryVis}
        onVisibilityChange={setBatteryVis}
      />
      <MoodEditor
        isOpen={activeEditor === 'mood'}
        onClose={handleEditorDismiss}
        onShare={handleMoodShare}
        value={mood}
        onChange={setMood}
        visibility={effectiveMoodVis}
        onVisibilityChange={setMoodVis}
      />
      <SongEditor
        isOpen={activeEditor === 'song'}
        onClose={handleEditorDismiss}
        onShare={handleSongShare}
        trackId={trackId}
        onChange={setTrackId}
        visibility={effectiveSongVis}
        onVisibilityChange={setSongVis}
      />
      <ThoughtEditor
        isOpen={activeEditor === 'thought'}
        onClose={handleEditorDismiss}
        onShare={handleThoughtShare}
        value={thought}
        onChange={setThought}
        visibility={effectiveThoughtVis}
        onVisibilityChange={setThoughtVis}
      />
    </MainScrollContainer>
  );
}
