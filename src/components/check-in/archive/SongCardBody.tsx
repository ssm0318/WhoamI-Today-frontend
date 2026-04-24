import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { Layout, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { CheckInComponentEntry } from '@models/checkInEntry';
import * as S from './ArchiveCard.styled';

interface Props {
  entry: CheckInComponentEntry;
}

/**
 * Song card body — album cover + title + artist.
 *
 * Prefers the metadata cached in `entry.data` (populated at save time by
 * the Song post_save signal's oEmbed fetch) to avoid an extra HTTP call
 * per card. Falls back to the Spotify SDK when metadata is missing —
 * this covers backfilled rows that were written with just `{track_id}`.
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

  const [resolved, setResolved] = useState<{
    title: string;
    artist: string;
    cover: string | null;
  } | null>(() => {
    if (data.title) {
      return {
        title: data.title,
        artist: data.artist ?? '',
        cover: data.album_cover_url ?? null,
      };
    }
    return null;
  });

  useEffect(() => {
    if (resolved) return;
    if (!data.track_id) return;
    const mgr = SpotifyManager.getInstance();
    mgr
      .getTrack(data.track_id)
      .then((track: Track | null) => {
        if (!track) return;
        setResolved({
          title: track.name,
          artist: track.artists?.map((a) => a.name).join(', ') ?? '',
          cover: track.album?.images?.[0]?.url ?? null,
        });
      })
      .catch(() => {
        // Leave `resolved` null; body will render an empty state silently
      });
  }, [data.track_id, resolved]);

  if (!resolved) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" justifyContent="center">
        <Typo type="label-small" color="MEDIUM_GRAY">
          {data.track_id ?? ''}
        </Typo>
      </Layout.FlexCol>
    );
  }

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

export default SongCardBody;
