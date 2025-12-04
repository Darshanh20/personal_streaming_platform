import express from 'express';
import { exchangeCodeForTokens, getCurrentlyPlaying, refreshAccessToken, getStoredTokens } from '../lib/spotifyAuth.js';

const router = express.Router();

/**
 * GET /api/spotify/login
 * Redirects user to Spotify authorization URL
 */
router.get('/login', (req, res) => {
  const scopes = 'user-read-currently-playing user-read-playback-state';
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append('show_dialog', 'true');

  res.redirect(authUrl.toString());
});

/**
 * GET /api/spotify/callback
 * Handles Spotify authorization callback
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ success: false, error: error || 'Authorization failed' });
  }

  if (!code) {
    return res.status(400).json({ success: false, error: 'Missing authorization code' });
  }

  try {
    await exchangeCodeForTokens(code);
    
    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/songs?spotify=connected`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/songs?spotify=error`);
  }
});

/**
 * GET /api/spotify/now-playing
 * Returns currently playing track on Spotify
 */
router.get('/now-playing', async (req, res) => {
  try {
    const data = await getCurrentlyPlaying();
    res.json({ success: true, data });
  } catch (error) {
    // If not authenticated, return error with helpful message
    if (error.message.includes('Not authenticated')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated with Spotify',
        code: 'NOT_AUTHENTICATED',
      });
    }

    // For other errors, try to parse Spotify API errors
    console.error('Spotify API error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch currently playing track',
    });
  }
});

/**
 * GET /api/spotify/refresh
 * Manually refresh access token
 */
router.get('/refresh', async (req, res) => {
  try {
    const tokens = await refreshAccessToken();
    res.json({ success: true, message: 'Token refreshed', tokens: { accessToken: tokens.accessToken, expiresAt: tokens.expiresAt } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to refresh token' });
  }
});

/**
 * GET /api/spotify/status
 * Check if user is authenticated
 */
router.get('/status', (req, res) => {
  const tokens = getStoredTokens();
  const isAuthenticated = !!tokens.accessToken;
  
  res.json({ 
    success: true, 
    authenticated: isAuthenticated,
    expiresAt: tokens.expiresAt,
  });
});

export default router;
