import { Track } from '@spotify/web-api-ts-sdk';
import { CSSProperties, useEffect, useState } from 'react';
import MusicDetailBottomSheet from '@components/music/music-detail-bottom-sheet/MusicDetailBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { User } from '@models/user';
import { FontType } from 'src/design-system/Font/Font.types';
import { StyledSpotifyMusic } from './SpotifyMusic.styled';

interface Props {
  /* track id 또는 track data 전달. */
  track?: string | Track | null;
  sharer?: User;
  useDetailBottomSheet?: boolean;
  useAlbumImg?: boolean;
  containerStyle?: CSSProperties;
  fontType?: FontType;
}

function SpotifyMusic({
  track,
  sharer,
  containerStyle,
  fontType = 'label-medium',
  useDetailBottomSheet = false,
  useAlbumImg = false,
}: Props) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  useEffect(() => {
    if (!track) return setTrackData(null);
    if (typeof track !== 'string') return setTrackData(track);
    spotifyManager.getTrack(track).then(setTrackData);
  }, [spotifyManager, track]);

  const [showMusicDetail, setShowMusicDetail] = useState(false);

  const handleClickMusic = () => {
    if (!useDetailBottomSheet) return;
    setShowMusicDetail(true);
  };

  return (
    <>
      <StyledSpotifyMusic type="button" onClick={handleClickMusic} disabled={!useDetailBottomSheet}>
        {!!trackData && (
          <Layout.FlexRow
            w="100%"
            outline="SPOTIFY_GREEN"
            rounded={12}
            justifyContent="center"
            alignItems="center"
            pv={4}
            ph={8}
            gap={4}
            bgColor="WHITE"
            style={{
              ...containerStyle,
            }}
          >
            {useAlbumImg ? (
              <img
                src={trackData?.album.images[0].url}
                width={16}
                height={16}
                alt={`${trackData?.name}-album`}
                style={{
                  borderRadius: 4,
                }}
              />
            ) : (
              <SpotifyIcon />
            )}
            <Typo type={fontType} numberOfLines={1}>
              {trackData.artists[0].name} - {trackData.name}
            </Typo>
            {useAlbumImg && <SpotifyIcon />}
          </Layout.FlexRow>
        )}
      </StyledSpotifyMusic>
      {useDetailBottomSheet && (
        <MusicDetailBottomSheet
          visible={showMusicDetail}
          closeBottomSheet={() => {
            setShowMusicDetail(false);
          }}
          sharer={sharer}
          track={trackData}
        />
      )}
    </>
  );
}
export default SpotifyMusic;

function SpotifyIcon() {
  return (
    <Layout.LayoutBase w={16} h={16}>
      <SvgIcon name="spotify" size={16} />
    </Layout.LayoutBase>
  );
}
