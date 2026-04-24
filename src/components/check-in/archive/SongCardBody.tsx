import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { CheckInComponentEntry } from '@models/checkInEntry';
import * as S from './ArchiveCard.styled';

interface Props {
  entry: CheckInComponentEntry;
}

type Resolved = { title: string; artist: string; cover: string | null };

/**
 * Spotify track ids are 22-char base62. Bogus ids (test fixtures like
 * `fixtureXYZ` or truncated strings) cause the Spotify SDK + oEmbed to
 * bounce back with 400 / CORS errors after a noticeable delay and then
 * fall through to the failure placeholder anyway — worst of both worlds.
 * Short-circuit those straight to the failure fallback and never hit the
 * network.
 */
const SPOTIFY_TRACK_ID_RE = /^(?:spotify:track:)?[A-Za-z0-9]{22}$/;
const isValidTrackId = (trackId: string | undefined | null): boolean =>
  !!trackId && SPOTIFY_TRACK_ID_RE.test(trackId);

/**
 * Song card body — album cover + title + artist.
 *
 * Prefers the metadata cached in `entry.data` (populated at save time by
 * the Song post_save signal's oEmbed fetch) to avoid an extra HTTP call
 * per card. Falls back to the Spotify SDK when metadata is missing —
 * this covers backfilled rows that were written with just `{track_id}`.
 *
 * Render states:
 *   * resolved   → album cover + title + artist
 *   * loading    → skeleton (cover block + title/artist lines). Flickers
 *                  briefly for every backfilled row on first render.
 *   * failed     → neutral "Song" fallback with music-note icon, so a
 *                  transient Spotify outage or a revoked track never
 *                  drops a raw `spotify:track:XYZ` string onto the card.
 *
 * Tapping the card opens the shared Spotify bottom sheet via the
 * Archive screen's `onBodyClick` handler.
 */
function SongCardBody({ entry }: Props) {
  const data = entry.data as {
    track_id?: string;
    title?: string | null;
    artist?: string | null;
    album_cover_url?: string | null;
  };

  const initial: Resolved | null = data.title
    ? {
        title: data.title,
        artist: data.artist ?? '',
        cover: data.album_cover_url ?? null,
      }
    : null;

  const trackIdLooksValid = isValidTrackId(data.track_id);

  const [resolved, setResolved] = useState<Resolved | null>(initial);
  const [isResolving, setIsResolving] = useState<boolean>(!initial && trackIdLooksValid);
  const [didFail, setDidFail] = useState<boolean>(
    !initial && !trackIdLooksValid && Boolean(data.track_id),
  );

  useEffect(() => {
    if (resolved) return;
    if (!trackIdLooksValid) {
      setIsResolving(false);
      return;
    }
    let cancelled = false;
    setIsResolving(true);
    SpotifyManager.getInstance()
      .getTrack(data.track_id!)
      .then((track: Track | null) => {
        if (cancelled) return;
        if (!track) {
          setDidFail(true);
          return;
        }
        setResolved({
          title: track.name,
          artist: track.artists?.map((a) => a.name).join(', ') ?? '',
          cover: track.album?.images?.[0]?.url ?? null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setDidFail(true);
      })
      .finally(() => {
        if (!cancelled) setIsResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [data.track_id, resolved, trackIdLooksValid]);

  if (resolved) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" gap={6}>
        {resolved.cover && <S.AlbumCover src={resolved.cover} alt={resolved.title} />}
        <Layout.FlexCol w="100%" alignItems="center" gap={0}>
          <S.ClampText lines={1}>
            <Typo type="label-medium" color="DARK">
              {resolved.title}
            </Typo>
          </S.ClampText>
          {resolved.artist && (
            <S.ClampText lines={1}>
              <Typo type="label-small" color="DARK_GRAY">
                {resolved.artist}
              </Typo>
            </S.ClampText>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    );
  }

  if (isResolving) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" gap={6}>
        <S.AlbumCoverSkeleton aria-hidden />
        <Layout.FlexCol alignItems="center" gap={3}>
          <S.TextLineSkeleton $width={80} />
          <S.TextLineSkeleton $width={60} />
        </Layout.FlexCol>
      </Layout.FlexCol>
    );
  }

  if (didFail || !data.track_id) {
    // Unresolvable song — render a neutral fallback rather than leak raw ids.
    return (
      <Layout.FlexCol w="100%" alignItems="center" gap={6}>
        <Layout.FlexCol
          w={68}
          h={68}
          rounded={8}
          bgColor="LIGHT"
          alignItems="center"
          justifyContent="center"
        >
          <SvgIcon name="spotify" size={28} color="MEDIUM_GRAY" />
        </Layout.FlexCol>
        <Typo type="label-small" color="MEDIUM_GRAY">
          Song
        </Typo>
      </Layout.FlexCol>
    );
  }

  return null;
}

export default SongCardBody;
