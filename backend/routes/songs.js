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

export default router;
