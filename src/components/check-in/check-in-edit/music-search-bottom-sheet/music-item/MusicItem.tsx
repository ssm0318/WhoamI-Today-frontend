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
      <Layout.FlexRow gap={12} flex={1}>
        {/* 썸네일 */}
        {track.album.images.length > 0 && track.album.images[0].url ? (
          <img
            src={track.album.images[0].url}
            width={44}
            height={44}
            alt={`${track.name}-album`}
            style={{
              borderRadius: 4,
            }}
          />
        ) : (
          <Layout.FlexRow w={44} h={44} bgColor="LIGHT" rounded={4} />
        )}
        {/* 제목 & 아티스트 */}
        <Layout.FlexCol justifyContent="center" w="100%" flex={1}>
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
