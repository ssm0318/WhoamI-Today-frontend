import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import BatteryEditor from '@components/check-in/update-quadrant/BatteryEditor';
import MoodEditor from '@components/check-in/update-quadrant/MoodEditor';
import SongEditor from '@components/check-in/update-quadrant/SongEditor';
import ThoughtEditor from '@components/check-in/update-quadrant/ThoughtEditor';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { ComponentVisibility, DEFAULT_VISIBILITY, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';
import { MainScrollContainer } from '../Root';
import { ArchivedBadge, GridContainer, QuadrantCard, QuadrantLabel } from './UpdateCheckin.styled';

type EditorTarget = 'battery' | 'mood' | 'song' | 'thought' | null;

const ARCHIVE_THRESHOLD_MS = 12 * 60 * 60 * 1000;

function isArchived(updatedAt?: string): boolean {
  if (!updatedAt) return false;
  return Date.now() - new Date(updatedAt).getTime() > ARCHIVE_THRESHOLD_MS;
}

export default function UpdateCheckin() {
  const { checkIn, fetchCheckIn, setCheckInSaveHandler, setCheckInSaving } = useBoundStore(
    (state) => ({
      checkIn: state.checkIn,
      fetchCheckIn: state.fetchCheckIn,
      setCheckInSaveHandler: state.setCheckInSaveHandler,
      setCheckInSaving: state.setCheckInSaving,
    }),
  );

  const sendMessage = usePostAppMessage();

  const [activeEditor, setActiveEditor] = useState<EditorTarget>(null);

  const [battery, setBattery] = useState<SocialBattery | null>(null);
  const [mood, setMood] = useState('');
  const [trackId, setTrackId] = useState('');
  const [thought, setThought] = useState('');

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
    const ci = await fetchCheckIn();
    if (!ci) return;
    setBattery(ci.social_battery || null);
    setMood(ci.mood || '');
    setTrackId(ci.track_id || '');
    setThought(ci.description || '');
    if (ci.battery_visibility) setBatteryVis(ci.battery_visibility);
    if (ci.mood_visibility) setMoodVis(ci.mood_visibility);
    if (ci.song_visibility) setSongVis(ci.song_visibility);
    if (ci.thought_visibility) setThoughtVis(ci.thought_visibility);
  }, []);

  const batteryArchived = useMemo(
    () => !!battery && isArchived(checkIn?.battery_updated_at),
    [battery, checkIn?.battery_updated_at],
  );
  const moodArchived = useMemo(
    () => !!mood && isArchived(checkIn?.mood_updated_at),
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

  const handleSave = useCallback(async () => {
    setCheckInSaving(true);
    try {
      await postCheckIn({
        social_battery: battery,
        mood,
        description: thought,
        track_id: trackId,
        battery_visibility: batteryVis,
        mood_visibility: moodVis,
        song_visibility: songVis,
        thought_visibility: thoughtVis,
      });
      if (window.ReactNativeWebView) {
        sendMessage('WIDGET_DATA_UPDATED', {});
      }
      await fetchCheckIn();
    } finally {
      setCheckInSaving(false);
    }
  }, [
    battery,
    mood,
    thought,
    trackId,
    batteryVis,
    moodVis,
    songVis,
    thoughtVis,
    fetchCheckIn,
    sendMessage,
    setCheckInSaving,
  ]);

  // Register save handler for the header Save button
  useEffect(() => {
    setCheckInSaveHandler(handleSave);
    return () => setCheckInSaveHandler(null);
  }, [handleSave, setCheckInSaveHandler]);

  return (
    <MainScrollContainer>
      <GridContainer>
        {/* Top-Left: Social Battery */}
        <QuadrantCard
          $isEmpty={!battery}
          $isArchived={batteryArchived}
          onClick={() => setActiveEditor('battery')}
        >
          {batteryArchived && <ArchivedBadge>Only Me</ArchivedBadge>}
          {battery ? (
            <>
              <span style={{ fontSize: 40, lineHeight: 1 }}>
                {SocialBatteryChipAssets[battery]?.emoji || ''}
              </span>
              <QuadrantLabel>Social Battery</QuadrantLabel>
            </>
          ) : (
            <>
              <SvgIcon name="add_reaction_default" size={32} />
              <QuadrantLabel>Social Battery</QuadrantLabel>
            </>
          )}
        </QuadrantCard>

        {/* Top-Right: Mood */}
        <QuadrantCard
          $isEmpty={!mood}
          $isArchived={moodArchived}
          onClick={() => setActiveEditor('mood')}
        >
          {moodArchived && <ArchivedBadge>Only Me</ArchivedBadge>}
          {mood ? (
            <>
              <EmojiItem emojiString={mood} size={40} bgColor="TRANSPARENT" outline="TRANSPARENT" />
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
          {songArchived && <ArchivedBadge>Only Me</ArchivedBadge>}
          {trackId && trackData ? (
            <Layout.FlexCol w="100%" alignItems="center" gap={6}>
              {trackData.album?.images?.[0]?.url && (
                <img
                  src={trackData.album.images[0].url}
                  alt="album"
                  style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                />
              )}
              <Typo type="label-medium" numberOfLines={1} textAlign="center">
                {trackData.name}
              </Typo>
              <Typo type="label-small" color="MEDIUM_GRAY" numberOfLines={1} textAlign="center">
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
          {thoughtArchived && <ArchivedBadge>Only Me</ArchivedBadge>}
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

      {/* Editor Popups */}
      <BatteryEditor
        isOpen={activeEditor === 'battery'}
        onClose={() => setActiveEditor(null)}
        value={battery}
        onChange={setBattery}
        visibility={batteryVis}
        onVisibilityChange={setBatteryVis}
      />
      <MoodEditor
        isOpen={activeEditor === 'mood'}
        onClose={() => setActiveEditor(null)}
        value={mood}
        onChange={setMood}
        visibility={moodVis}
        onVisibilityChange={setMoodVis}
      />
      <SongEditor
        isOpen={activeEditor === 'song'}
        onClose={() => setActiveEditor(null)}
        trackId={trackId}
        onChange={setTrackId}
        visibility={songVis}
        onVisibilityChange={setSongVis}
      />
      <ThoughtEditor
        isOpen={activeEditor === 'thought'}
        onClose={() => setActiveEditor(null)}
        value={thought}
        onChange={setThought}
        visibility={thoughtVis}
        onVisibilityChange={setThoughtVis}
      />
    </MainScrollContainer>
  );
}
