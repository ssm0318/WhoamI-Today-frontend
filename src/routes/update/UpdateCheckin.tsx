import { useCallback, useMemo, useState } from 'react';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import MainContainer from '@components/_common/main-container/MainContainer';
import BatteryEditor from '@components/check-in/update-quadrant/BatteryEditor';
import MoodEditor from '@components/check-in/update-quadrant/MoodEditor';
import SongEditor from '@components/check-in/update-quadrant/SongEditor';
import ThoughtEditor from '@components/check-in/update-quadrant/ThoughtEditor';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ComponentVisibility, DEFAULT_VISIBILITY, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';
import {
  ArchivedBadge,
  GridContainer,
  QuadrantCard,
  QuadrantLabel,
  SaveButtonWrapper,
} from './UpdateCheckin.styled';

type EditorTarget = 'battery' | 'mood' | 'song' | 'thought' | null;

const ARCHIVE_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 hours

function isArchived(updatedAt?: string): boolean {
  if (!updatedAt) return false;
  return Date.now() - new Date(updatedAt).getTime() > ARCHIVE_THRESHOLD_MS;
}

export default function UpdateCheckin() {
  const { checkIn, fetchCheckIn } = useBoundStore((state) => ({
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const sendMessage = usePostAppMessage();

  const [activeEditor, setActiveEditor] = useState<EditorTarget>(null);
  const [saving, setSaving] = useState(false);

  // Draft state for all 4 components
  const [battery, setBattery] = useState<SocialBattery | null>(null);
  const [mood, setMood] = useState('');
  const [trackId, setTrackId] = useState('');
  const [thought, setThought] = useState('');

  // Per-component visibility
  const [batteryVis, setBatteryVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.battery);
  const [moodVis, setMoodVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.mood);
  const [songVis, setSongVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.song);
  const [thoughtVis, setThoughtVis] = useState<ComponentVisibility>(DEFAULT_VISIBILITY.thought);

  // Load existing check-in data
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

  // Detect archived state per component
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
    setSaving(true);
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
      setSaving(false);
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
  ]);

  return (
    <MainContainer>
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
          {trackId ? (
            <Layout.FlexCol w="100%" alignItems="center" gap={4}>
              <SpotifyMusic track={trackId} useAlbumImg fontType="label-small" />
              <QuadrantLabel>Song</QuadrantLabel>
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

      <SaveButtonWrapper>
        <Button.Primary
          text={saving ? 'Saving...' : 'Save'}
          status={saving ? 'disabled' : 'normal'}
          onClick={handleSave}
        />
      </SaveButtonWrapper>

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
    </MainContainer>
  );
}
