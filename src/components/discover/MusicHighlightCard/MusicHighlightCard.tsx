import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { Layout, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { MusicHighlightCardBody } from '@models/discover';
import * as S from './MusicHighlightCard.styled';

interface MusicHighlightCardProps {
  highlight: MusicHighlightCardBody;
}

function MusicHighlightCard({ highlight }: MusicHighlightCardProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  useEffect(() => {
    spotifyManager
      .getTrack(highlight.trackId)
      .then(setTrackData)
      .catch(() => setTrackData(null));
  }, [highlight.trackId, spotifyManager]);

  const albumArtUrl = trackData?.album?.images?.[0]?.url;
  const trackName = trackData?.name ?? 'Loading...';
  const artistName = trackData?.artists?.[0]?.name ?? '';
  const spotifyUrl =
    trackData?.external_urls?.spotify ?? `https://open.spotify.com/track/${highlight.trackId}`;

  if (!trackData) {
    return null;
  }

  return (
    <S.MusicHighlightWrapper>
      <Layout.FlexRow gap={4} alignItems="center" style={{ opacity: 0.7 }}>
        <Typo type="label-medium" color="WHITE">
          Trending in Community
        </Typo>
      </Layout.FlexRow>

      <S.AlbumArtContainer>
        {albumArtUrl ? (
          <img src={albumArtUrl} alt={trackName} />
        ) : (
          <S.PlaceholderIcon>&#9835;</S.PlaceholderIcon>
        )}
      </S.AlbumArtContainer>

      <Layout.FlexCol gap={4} w="100%">
        <Typo type="title-medium" color="WHITE">
          {trackName}
        </Typo>
        {artistName && (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {artistName}
          </Typo>
        )}
        <Layout.LayoutBase mt={2}>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            Shared by @{highlight.sharedByUsername}
          </Typo>
        </Layout.LayoutBase>
      </Layout.FlexCol>

      <S.ListenButton href={spotifyUrl} target="_blank" rel="noopener noreferrer">
        <Typo type="label-large" color="WHITE" fontWeight={600}>
          Listen on Spotify
        </Typo>
      </S.ListenButton>
    </S.MusicHighlightWrapper>
  );
}

export default MusicHighlightCard;
