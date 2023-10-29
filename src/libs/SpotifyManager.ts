import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk';

class SpotifyManager {
  private static instance: SpotifyManager | null = null;

  private spotifyApi: SpotifyApi | null = null;

  static getInstance(): SpotifyManager {
    if (!this.instance) {
      this.instance = new SpotifyManager();
    }
    return this.instance;
  }

  initialize = async () => {
    const clientId = '25e0c6948c6a46c583bfd392d57d17ac';
    const clientSecret = '2a6ec670393a45a7b0ebd6fc8c6b3c88';
    const scopes = ['user-read-private'];

    try {
      this.spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret, scopes);
      console.log('SpotifyApi initialized.');
    } catch (error) {
      console.error('Failed to initialize SpotifyApi:', error);
      throw error;
    }
  };

  // searchMusic = async (query: string): Promise<Pick<PartialSearchResult, 'artists' | 'tracks'>> => {
  //   if (!this.spotifyApi) {
  //     throw new Error('SpotifyApi is not initialized.');
  //   }

  //   try {
  //     const results = await this.spotifyApi.search(query, ['track', 'artist']);
  //     return results;
  //   } catch (error) {
  //     console.error('Error searching music:', error);
  //     throw error;
  //   }
  // };

  getTrack = async (trackId: string): Promise<Track> => {
    if (!this.spotifyApi) {
      throw new Error('SpotifyApi is not initialized.');
    }

    try {
      const res = await this.spotifyApi.makeRequest('GET', `tracks/${trackId}`);
      return res as Track;
    } catch (error) {
      console.error('Error searching music:', error);
      throw error; // or handle it appropriately
    }
  };
}

export default SpotifyManager;
