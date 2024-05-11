import { Track } from '@spotify/web-api-ts-sdk';
import { Layout, StyledCheckBox, Typo } from '@design-system';

type MusicItemProps = {
  track: Track;
  onSelect: (track: Track) => void;
  selected: boolean;
};

function MusicItem({ track, onSelect, selected }: MusicItemProps) {
  return (
    <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
      <Layout.FlexRow gap={12}>
        {/* 썸네일 */}
        <img
          src={track.album.images[0].url}
          width={44}
          height={44}
          alt={`${track.name}-album`}
          style={{
            borderRadius: 4,
          }}
        />
        {/* 제목 & 아티스트 */}
        <Layout.FlexCol justifyContent="center">
          <Typo type="body-large" numberOfLines={1}>
            {track.name}
          </Typo>
          <Typo type="body-small" numberOfLines={1} color="MEDIUM_GRAY">
            {track.artists[0].name}
          </Typo>
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* check box */}
      <Layout.FlexRow>
        <StyledCheckBox name={track.id} onChange={() => onSelect(track)} checked={selected} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MusicItem;