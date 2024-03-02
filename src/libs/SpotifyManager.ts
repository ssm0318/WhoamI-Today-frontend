import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../key';

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
    const clientId = SPOTIFY_CLIENT_ID;
    const clientSecret = SPOTIFY_CLIENT_SECRET;
    const scopes = ['user-read-private'];

    try {
      this.spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret, scopes);
      console.log('SpotifyApi initialized.');
    } catch (error) {
      console.error('Failed to initialize SpotifyApi:', error);
      throw error;
    }
  };

  searchMusic = async (query: string, limit: number, offset: number): Promise<Track[]> => {
    if (!this.spotifyApi) {
      throw new Error('SpotifyApi is not initialized.');
    }

    try {
      const result = (await this.spotifyApi.makeRequest(
        'GET',
        `search?q=${query}&type=track&limit=${limit}&ffset=${offset}`,
      )) as { tracks: { items: Track[] } };
      return result.tracks.items;
    } catch (error) {
      console.error('Error searching music:', error);
      throw error;
    }
  };

  getTrack = async (trackId: string): Promise<Track> => {
    if (!this.spotifyApi) {
      throw new Error('SpotifyApi is not initialized.');
    }

    try {
      const res = await this.spotifyApi.makeRequest('GET', `tracks/${trackId}`);
      return res as Track;
    } catch (error) {
      console.error('Error searching music:', error);
      throw error;
    }
  };
}

export default SpotifyManager;
