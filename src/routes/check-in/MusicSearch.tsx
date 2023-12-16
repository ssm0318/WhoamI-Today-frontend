import { Track } from '@spotify/web-api-ts-sdk';
import { ChangeEvent, useState } from 'react';
import MainContainer from '@components/_common/main-container/MainContainer';
import SpotifyMusic from '@components/check-in/spotify-music/SpotifyMusic';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Input, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';

function MusicSearch() {
  const spotifyManager = SpotifyManager.getInstance();

  const [query, setQuery] = useState('');

  const [trackList, setTrackList] = useState<Track[]>([]);

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectMusic = (track: Track) => {
    console.log(track);
    // TODO(Gina) 저장 API
  };

  useAsyncEffect(async () => {
    if (!query) return;
    const tracks = await spotifyManager.searchMusic(query, 20, 0);
    setTrackList(tracks);
  }, [query]);

  return (
    <MainContainer>
      <SubHeader title="Search Music" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} pb="default" w="100%" gap={10} ph="default">
        <Input label="music search" value={query} onChange={handleChangeQuery} />
        {trackList.map((track) => (
          <Layout.FlexRow key={track.id} onClick={() => handleSelectMusic(track)}>
            <SpotifyMusic track={track} width={250} />
          </Layout.FlexRow>
        ))}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default MusicSearch;
