import express from 'express';
import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/multer.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { ipAuth } from '../middleware/ipAuth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Sanitize filename for Cloudinary
 * Removes special characters that Cloudinary's public_id doesn't allow
 */
const sanitizeFilename = (filename) => {
  return filename
    .split('.')[0] // Remove extension
    .replace(/[^a-zA-Z0-9\-_]/g, '-') // Replace special chars with hyphens
    .replace(/--+/g, '-') // Collapse multiple hyphens
    .toLowerCase()
    .substring(0, 50); // Limit length
};

/**
 * POST /admin/upload
 * Secret key protected route - only accessible with x-admin-key header
 * Uploads audio, lyrics, and cover to Cloudinary
 * Saves metadata to PostgreSQL
 *
 * Headers:
 * - x-admin-key: SECRET_KEY (required)
 *
 * Form Fields:
 * - audio (File): MP3 or WAV - REQUIRED
 * - lyrics (File): TXT - Optional
 * - cover (File): JPG/PNG/WebP - Optional
 * - title (String): Song title - REQUIRED
 * - description (String): Song description - Optional
 * - duration (Number): Duration in seconds - REQUIRED
 * - tags (String): Comma-separated tags - Optional
 */
router.post(
  '/upload',
  ipAuth,        // Check IP first (network-level security)
  adminAuth,     // Then validate secret key (application-level security)
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'lyrics', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Validate required fields
      const { title, description, duration, tags } = req.body;
      const { audio, lyrics, cover } = req.files || {};

      if (!title || !duration) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title and duration',
        });
      }

      if (!audio || !audio[0]) {
        return res.status(400).json({
          success: false,
          error: 'Audio file is required',
        });
      }

      // Upload audio file to Cloudinary
      let audioUrl = null;
      if (audio && audio[0]) {
        audioUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/audio',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(audio[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(audio[0].buffer);
        });
      }

      // Upload lyrics file to Cloudinary
      let lyricsUrl = null;
      if (lyrics && lyrics[0]) {
        lyricsUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/lyrics',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(lyrics[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(lyrics[0].buffer);
        });
      }

      // Upload cover image to Cloudinary
      let coverUrl = null;
      if (cover && cover[0]) {
        coverUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/covers',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(cover[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(cover[0].buffer);
        });
      }

      // Parse tags from comma-separated string to array
      const tagsArray = tags
        ? tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      // Get the first admin from database
      const admin = await prisma.admin.findFirst();
      if (!admin) {
        return res.status(500).json({
          success: false,
          error: 'No admin found in database',
        });
      }

      // Save song metadata to PostgreSQL
      const song = await prisma.song.create({
        data: {
          title,
          description: description || null,
          audioUrl,
          lyricsUrl,
          coverUrl,
          duration: parseInt(duration, 10),
          tags: tagsArray,
          uploadedById: admin.id,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Song uploaded successfully',
        data: song,
      });
    } catch (error) {
      console.error('Upload error:', error);

      // Handle file type validation errors
      if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      // Handle Cloudinary errors
      if (error.http_code) {
        return res.status(500).json({
          success: false,
          error: `Cloudinary upload failed: ${error.message}`,
        });
      }

      // Handle Prisma errors
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'A song with this title already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
);

/**
 * GET /admin/songs
 * Retrieve all songs (including unpublished) for admin dashboard
 * Only accessible with valid admin authentication
 */
router.get('/songs', adminAuth, async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
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
 * DELETE /admin/songs/:id
 * Delete a song by ID (requires admin authentication)
 * Also deletes associated files from Cloudinary
 *
 * Headers:
 * - x-admin-key: SECRET_KEY (required)
 */
router.delete(
  '/songs/:id',
  ipAuth,        // Check IP first
  adminAuth,     // Validate secret key
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find the song first to get file URLs
      const song = await prisma.song.findUnique({
        where: { id },
      });

      if (!song) {
        return res.status(404).json({
          success: false,
          error: 'Song not found',
        });
      }

      // Delete files from Cloudinary
      if (song.audioUrl) {
        try {
          const publicId = song.audioUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`songs/audio/${publicId}`, { resource_type: 'auto' });
        } catch (err) {
          console.warn('Warning: Could not delete audio from Cloudinary:', err.message);
        }
      }

      if (song.lyricsUrl) {
        try {
          const publicId = song.lyricsUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`songs/lyrics/${publicId}`, { resource_type: 'auto' });
        } catch (err) {
          console.warn('Warning: Could not delete lyrics from Cloudinary:', err.message);
        }
      }

      if (song.coverUrl) {
        try {
          const publicId = song.coverUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`songs/covers/${publicId}`, { resource_type: 'auto' });
        } catch (err) {
          console.warn('Warning: Could not delete cover from Cloudinary:', err.message);
        }
      }

      // Delete song from database
      await prisma.song.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Song deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete song',
      });
    }
  }
);

/**
 * PUT /admin/songs/:id
 * Update a song by ID (requires admin authentication)
 * Can update metadata, audio, cover, and lyrics
 *
 * Headers:
 * - x-admin-key: SECRET_KEY (required)
 */
router.put(
  '/songs/:id',
  ipAuth,        // Check IP first
  adminAuth,     // Validate secret key
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'lyrics', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, duration, tags } = req.body;
      const { audio, lyrics, cover } = req.files || {};

      // Find the song first
      const song = await prisma.song.findUnique({
        where: { id },
      });

      if (!song) {
        return res.status(404).json({
          success: false,
          error: 'Song not found',
        });
      }

      let updateData = {};

      // Update text fields if provided
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (duration) updateData.duration = parseInt(duration, 10);
      if (tags) {
        updateData.tags = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      // Update audio file if provided
      if (audio && audio[0]) {
        // Delete old audio from Cloudinary
        if (song.audioUrl) {
          try {
            const publicId = song.audioUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`songs/audio/${publicId}`, { resource_type: 'auto' });
          } catch (err) {
            console.warn('Warning: Could not delete old audio:', err.message);
          }
        }

        // Upload new audio
        updateData.audioUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/audio',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(audio[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(audio[0].buffer);
        });
      }

      // Update lyrics file if provided
      if (lyrics && lyrics[0]) {
        // Delete old lyrics from Cloudinary
        if (song.lyricsUrl) {
          try {
            const publicId = song.lyricsUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`songs/lyrics/${publicId}`, { resource_type: 'auto' });
          } catch (err) {
            console.warn('Warning: Could not delete old lyrics:', err.message);
          }
        }

        // Upload new lyrics
        updateData.lyricsUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/lyrics',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(lyrics[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(lyrics[0].buffer);
        });
      }

      // Update cover image if provided
      if (cover && cover[0]) {
        // Delete old cover from Cloudinary
        if (song.coverUrl) {
          try {
            const publicId = song.coverUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`songs/covers/${publicId}`, { resource_type: 'auto' });
          } catch (err) {
            console.warn('Warning: Could not delete old cover:', err.message);
          }
        }

        // Upload new cover
        updateData.coverUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'songs/covers',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(cover[0].originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(cover[0].buffer);
        });
      }

      // Update song in database
      const updatedSong = await prisma.song.update({
        where: { id },
        data: updateData,
        include: {
          uploadedBy: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Song updated successfully',
        data: updatedSong,
      });
    } catch (error) {
      console.error('Update error:', error);

      // Handle Prisma errors
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'A song with this title already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update song',
      });
    }
  }
);

/**
 * PUT /admin/toggle-publish
 * Toggle the published status of a song
 * Only accessible with valid admin authentication
 *
 * Query Parameters:
 * - songId (String): The ID of the song to toggle - REQUIRED
 */
router.put('/toggle-publish', adminAuth, async (req, res) => {
  try {
    const { songId } = req.query;

    if (!songId) {
      return res.status(400).json({
        success: false,
        error: 'songId is required',
      });
    }

    // Get the current song
    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Toggle the published status
    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: {
        published: !song.published,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: `Song ${updatedSong.published ? 'published' : 'unpublished'} successfully`,
      data: updatedSong,
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to toggle publish status',
    });
  }
});

/**
 * GET /admin/analytics
 * Get analytics data about songs and plays
 * Returns: total songs, published count, plays, top songs, trends, etc.
 * Only accessible with valid admin authentication
 */
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // Get all songs
    const allSongs = await prisma.song.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    const totalSongs = allSongs.length;
    const totalPublishedSongs = allSongs.filter(song => song.published).length;
    const totalPlays = allSongs.reduce((sum, song) => sum + (song.plays || 0), 0);

    // Find most played song
    const mostPlayedSong = allSongs.length > 0
      ? allSongs.reduce((max, song) => (song.plays > (max.plays || 0) ? song : max), allSongs[0])
      : null;

    // Top 5 most played songs
    const topSongs = allSongs
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 5);

    // Published vs unpublished
    const publishStats = {
      published: totalPublishedSongs,
      drafts: totalSongs - totalPublishedSongs,
    };

    // Generate play trends (last 30 days) - based on createdAt as proxy
    const last30Days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const playsOnDay = allSongs
        .filter(song => song.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, song) => sum + (song.plays || 0), 0);

      last30Days.push({
        date: dateStr,
        playCount: playsOnDay,
      });
    }

    res.json({
      success: true,
      data: {
        totalSongs,
        totalPublishedSongs,
        totalPlays,
        mostPlayedSong,
        songs: allSongs,
        playTrends: last30Days,
        topSongs,
        publishStats,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch analytics',
    });
  }
});

/**
 * POST /admin/songs/:id/play
 * Increment play count for a song
 * Public endpoint - anyone can increment plays
 */
router.post('/songs/:id/play', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the song
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Increment play count
    const updatedSong = await prisma.song.update({
      where: { id },
      data: {
        plays: {
          increment: 1,
        },
      },
    });

    res.json({
      success: true,
      message: 'Play count incremented',
      data: {
        id: updatedSong.id,
        plays: updatedSong.plays,
      },
    });
  } catch (error) {
    console.error('Play increment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to increment play count',
    });
  }
});

export default router;