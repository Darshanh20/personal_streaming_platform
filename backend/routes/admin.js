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

export default router;

