import axios from 'axios';
import qs from 'qs';

// In-memory token storage
let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_BASE = 'https://accounts.spotify.com/api/token';

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(code) {
  try {
    const response = await axios.post(SPOTIFY_AUTH_BASE, qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    tokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: Date.now() + (response.data.expires_in * 1000),
    };

    return tokens;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken() {
  if (!tokens.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(SPOTIFY_AUTH_BASE, qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: tokens.refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    tokens.accessToken = response.data.access_token;
    tokens.expiresAt = Date.now() + (response.data.expires_in * 1000);

    return tokens;
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken() {
  if (!tokens.accessToken) {
    throw new Error('Not authenticated with Spotify');
  }

  // If token expires in less than 60 seconds, refresh
  if (tokens.expiresAt - Date.now() < 60000) {
    await refreshAccessToken();
  }

  return tokens.accessToken;
}

/**
 * Get currently playing track
 */
export async function getCurrentlyPlaying() {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // 204 = no content (nothing playing)
    if (response.status === 204) {
      return {
        playing: false,
        song: null,
        artists: null,
        albumArt: null,
        progress_ms: 0,
        duration_ms: 0,
        is_playing: false,
        track_url: null,
      };
    }

    const item = response.data.item || {};

    return {
      playing: response.data.is_playing,
      song: item.name || 'Unknown Track',
      artists: item.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      albumArt: item.album?.images?.[0]?.url || null,
      progress_ms: response.data.progress_ms || 0,
      duration_ms: item.duration_ms || 0,
      is_playing: response.data.is_playing || false,
      track_url: item.external_urls?.spotify || null,
    };
  } catch (error) {
    console.error('Error fetching currently playing:', error.response?.data || error.message);
    throw error;
  }
}

export function getStoredTokens() {
  return tokens;
}

export function setStoredTokens(newTokens) {
  tokens = newTokens;
}
