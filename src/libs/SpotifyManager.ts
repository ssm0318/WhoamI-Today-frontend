import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../key';

/**
 * Accept bare 22-char base62 ids and `spotify:track:<id>` URIs alike,
 * returning the bare id. The SDK and oEmbed both expect the bare form
 * on the wire; passing the URI form hits a 404/400 and wastes a round
 * trip before falling back.
 */
const normalizeTrackId = (trackId: string): string => {
  const prefix = 'spotify:track:';
  return trackId.startsWith(prefix) ? trackId.slice(prefix.length) : trackId;
};

class SpotifyManager {
  private static instance: SpotifyManager | null = null;

  private spotifyApi: SpotifyApi | null = null;

  // Per-session cache. Once a track resolves, re-renders and newly-mounted
  // song cards using the same id resolve synchronously instead of firing
  // another network call.
  private trackCache = new Map<string, Track>();

  // In-flight request dedup. If N cards mount at once requesting the same
  // track, they share a single promise instead of racing N identical
  // HTTP requests against Spotify's API.
  private pendingFetches = new Map<string, Promise<Track>>();

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

    // oEmbed title is "Artist - Track Name" format
    const fullTitle: string = data.title || '';
    const dashIndex = fullTitle.indexOf(' - ');
    const artistName = dashIndex > -1 ? fullTitle.substring(0, dashIndex) : '';
    const trackName = dashIndex > -1 ? fullTitle.substring(dashIndex + 3) : fullTitle;

    return {
      name: trackName,
      album: {
        images: [{ url: data.thumbnail_url, height: 300, width: 300 }],
      },
      artists: [{ name: artistName }],
      external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
    } as unknown as Track;
  };

  getTrack = async (trackId: string): Promise<Track> => {
    const bareId = normalizeTrackId(trackId);

    // Session cache — resolve synchronously for already-fetched ids.
    const cached = this.trackCache.get(bareId);
    if (cached) return cached;

    // In-flight dedup — concurrent callers share one promise.
    const pending = this.pendingFetches.get(bareId);
    if (pending) return pending;

    const fetchPromise = this.fetchTrackUncached(bareId)
      .then((track) => {
        this.trackCache.set(bareId, track);
        return track;
      })
      .finally(() => {
        this.pendingFetches.delete(bareId);
      });

    this.pendingFetches.set(bareId, fetchPromise);
    return fetchPromise;
  };

  private fetchTrackUncached = async (bareId: string): Promise<Track> => {
    // Try SDK first if available — gets the full Track shape with
    // structured artist array + higher-res album images.
    if (this.spotifyApi) {
      try {
        const res = await this.spotifyApi.makeRequest('GET', `tracks/${bareId}`);
        return res as Track;
      } catch (error) {
        console.warn('Spotify SDK failed, trying oEmbed fallback:', error);
      }
    }

    // Fallback to oEmbed (no auth required).
    return this.getTrackViaOEmbed(bareId);
  };
}

export default SpotifyManager;
