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

    if (!clientId || !clientSecret) {
      console.warn('Spotify credentials not configured. Using oEmbed fallback.');
      return;
    }

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
    if (!this.spotifyApi) throw new Error('SpotifyApi is not initialized.');

    const q = query.trim().replace(/\s+/g, ' ');
    if (!q) return [];

    const params = new URLSearchParams({
      q,
      type: 'track',
      limit: String(Math.min(Math.max(limit, 1), 50)),
      offset: String(Math.min(Math.max(offset, 0), 1000)),
    });

    try {
      const result = (await this.spotifyApi.makeRequest('GET', `search?${params.toString()}`)) as {
        tracks: { items: Track[] };
      };

      return result.tracks.items ?? [];
    } catch (error) {
      console.error('Error searching music:', error);
      throw error;
    }
  };

  /**
   * Fetch track info via Spotify oEmbed API (no auth required).
   * Returns a partial Track-like object with album art, title, and Spotify URL.
   */
  // eslint-disable-next-line class-methods-use-this
  private getTrackViaOEmbed = async (trackId: string): Promise<Track> => {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`,
    );
    if (!res.ok) throw new Error('oEmbed fetch failed');
    const data = await res.json();

    return {
      name: data.title || '',
      album: {
        images: [{ url: data.thumbnail_url, height: 300, width: 300 }],
      },
      artists: [{ name: '' }],
      external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
    } as unknown as Track;
  };

  getTrack = async (trackId: string): Promise<Track> => {
    // Try SDK first if available
    if (this.spotifyApi) {
      try {
        const res = await this.spotifyApi.makeRequest('GET', `tracks/${trackId}`);
        return res as Track;
      } catch (error) {
        console.warn('Spotify SDK failed, trying oEmbed fallback:', error);
      }
    }

    // Fallback to oEmbed (no auth required)
    return this.getTrackViaOEmbed(trackId);
  };
}

export default SpotifyManager;
