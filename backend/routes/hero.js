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
 */
const sanitizeFilename = (filename) => {
  return filename
    .split('.')[0]
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase()
    .substring(0, 50);
};

/**
 * GET /hero
 * Retrieve the current hero image settings (public endpoint)
 */
router.get('/', async (req, res) => {
  try {
    const heroImage = await prisma.heroImage.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!heroImage) {
      return res.json({
        success: true,
        data: null,
        message: 'No hero image configured yet',
      });
    }

    res.json({
      success: true,
      data: heroImage,
    });
  } catch (error) {
    console.error('Error fetching hero image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch hero image',
    });
  }
});

/**
 * POST /hero
 * Upload/set a new hero image (admin only)
 */
router.post(
  '/',
  ipAuth,
  adminAuth,
  upload.single('heroImage'),
  async (req, res) => {
    try {
      const { title, objectFit, opacity, blur, brightness, contrast } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Hero image file is required',
        });
      }

      // Upload to Cloudinary
      const imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'hero',
            resource_type: 'auto',
            public_id: `${Date.now()}-${sanitizeFilename(req.file.originalname)}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Delete old hero image if it exists
      const oldHero = await prisma.heroImage.findFirst();
      if (oldHero && oldHero.imageUrl) {
        try {
          const publicId = oldHero.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`hero/${publicId}`, { resource_type: 'auto' });
        } catch (err) {
          console.warn('Warning: Could not delete old hero image:', err.message);
        }
      }

      // Delete old record
      if (oldHero) {
        await prisma.heroImage.delete({
          where: { id: oldHero.id },
        });
      }

      // Create new hero image record
      const heroImage = await prisma.heroImage.create({
        data: {
          imageUrl,
          title: title || null,
          objectFit: objectFit || 'cover',
          opacity: opacity ? parseFloat(opacity) : 1,
          blur: blur ? parseInt(blur, 10) : 0,
          brightness: brightness ? parseFloat(brightness) : 1,
          contrast: contrast ? parseFloat(contrast) : 1,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hero image uploaded successfully',
        data: heroImage,
      });
    } catch (error) {
      console.error('Upload error:', error);

      if (error.http_code) {
        return res.status(500).json({
          success: false,
          error: `Cloudinary upload failed: ${error.message}`,
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload hero image',
      });
    }
  }
);

/**
 * PUT /hero/:id
 * Update hero image settings (admin only)
 */
router.put(
  '/:id',
  ipAuth,
  adminAuth,
  upload.single('heroImage'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, objectFit, opacity, blur, brightness, contrast } = req.body;

      // Find existing hero
      const existingHero = await prisma.heroImage.findUnique({
        where: { id },
      });

      if (!existingHero) {
        return res.status(404).json({
          success: false,
          error: 'Hero image not found',
        });
      }

      let updateData = {};

      // Update text/style fields
      if (title !== undefined) updateData.title = title || null;
      if (objectFit) updateData.objectFit = objectFit;
      if (opacity !== undefined) updateData.opacity = parseFloat(opacity);
      if (blur !== undefined) updateData.blur = parseInt(blur, 10);
      if (brightness !== undefined) updateData.brightness = parseFloat(brightness);
      if (contrast !== undefined) updateData.contrast = parseFloat(contrast);

      // If new image provided, upload it
      if (req.file) {
        // Upload new image
        const imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'hero',
              resource_type: 'auto',
              public_id: `${Date.now()}-${sanitizeFilename(req.file.originalname)}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        updateData.imageUrl = imageUrl;

        // Delete old image from Cloudinary
        if (existingHero.imageUrl) {
          try {
            const publicId = existingHero.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`hero/${publicId}`, { resource_type: 'auto' });
          } catch (err) {
            console.warn('Warning: Could not delete old image:', err.message);
          }
        }
      }

      // Update in database
      const updatedHero = await prisma.heroImage.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Hero image updated successfully',
        data: updatedHero,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update hero image',
      });
    }
  }
);

/**
 * DELETE /hero/:id
 * Delete hero image (admin only)
 */
router.delete(
  '/:id',
  ipAuth,
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const heroImage = await prisma.heroImage.findUnique({
        where: { id },
      });

      if (!heroImage) {
        return res.status(404).json({
          success: false,
          error: 'Hero image not found',
        });
      }

      // Delete from Cloudinary
      if (heroImage.imageUrl) {
        try {
          const publicId = heroImage.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`hero/${publicId}`, { resource_type: 'auto' });
        } catch (err) {
          console.warn('Warning: Could not delete from Cloudinary:', err.message);
        }
      }

      // Delete from database
      await prisma.heroImage.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Hero image deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete hero image',
      });
    }
  }
);

export default router;
