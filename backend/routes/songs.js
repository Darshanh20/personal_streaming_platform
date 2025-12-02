import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /songs
 * Retrieve all published songs from the database
 * Sorted by creation date (newest first)
 * Public users only see published = true
 */
router.get('/', async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      where: {
        published: true, // Only return published songs to public
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch songs',
    });
  }
});

/**
 * GET /songs/:id
 * Retrieve a single published song by ID
 * Public users only see published = true
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Check if song is published for public access
    if (!song.published) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    res.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch song',
    });
  }
});

/**
 * POST /songs/:id/play
 * Increment play count for a song
 * Uses session-based debouncing: one count per session
 * Client sends session ID to avoid duplicate counts
 */
router.post('/:id/play', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    // Validate song ID
    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid song ID',
      });
    }

    // Check if song exists and is published
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    if (!song.published) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Debouncing: store session plays in memory (or Redis in production)
    // For now, we'll use a simple in-memory Set per song
    // In production, use Redis with TTL for session tracking
    if (!global.songPlaySessions) {
      global.songPlaySessions = {};
    }

    const sessionKey = `${id}:${sessionId}`;
    
    // Check if this session has already played this song
    if (!global.songPlaySessions[sessionKey]) {
      // First time this session plays this song
      global.songPlaySessions[sessionKey] = true;

      // Increment plays count
      const updatedSong = await prisma.song.update({
        where: { id },
        data: {
          plays: {
            increment: 1,
          },
        },
      });

      // Clean up old sessions after 24 hours (in production, use Redis TTL)
      setTimeout(() => {
        delete global.songPlaySessions[sessionKey];
      }, 24 * 60 * 60 * 1000);

      res.json({
        success: true,
        message: 'Play count incremented',
        plays: updatedSong.plays,
      });
    } else {
      // Session has already played this song, don't increment
      res.json({
        success: true,
        message: 'Play already counted for this session',
        plays: song.plays,
      });
    }
  } catch (error) {
    console.error('Error tracking play:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to track play',
    });
  }
});

export default router;
