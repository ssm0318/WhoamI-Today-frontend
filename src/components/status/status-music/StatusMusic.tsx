import { Track } from '@spotify/web-api-ts-sdk';
import { Font, Layout, SvgIcon } from '@design-system';

interface StatusMusicProps {
  track: Track;
  width?: number;
}

function StatusMusic({ track, width = 200 }: StatusMusicProps) {
  return (
    <Layout.FlexRow
      outline="SPOTIFY_GREEN"
      ph={8}
      pv={4}
      gap={4}
      rounded={12}
      alignItems="center"
      bgColor="WHITE"
      w={width}
    >
      <img
        src={track.album.images[0].url}
        width={16}
        height={16}
        alt={`${track.name}-album`}
        style={{
          borderRadius: 4,
        }}
      />
      <Font.Body type="12_semibold">
        {track.artists[0].name} - {track.name}
      </Font.Body>
      <Layout.LayoutBase w={16} h={16}>
        <SvgIcon name="spotify" size={16} />
      </Layout.LayoutBase>
    </Layout.FlexRow>
  );
}

export default StatusMusic;
