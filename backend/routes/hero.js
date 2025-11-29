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
 * Upload/set a new hero configuration (admin only)
 */
router.post(
  '/',
  ipAuth,
  adminAuth,
  upload.single('heroImage'),
  async (req, res) => {
    try {
      const {
        heading,
        subheading,
        overlayColor,
        overlayOpacity,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        textColor,
        textShadow,
        imageFit,
        imageOpacity,
        blur,
        brightness,
        contrast,
        enabled,
      } = req.body;

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

      // Create new hero configuration
      const heroImage = await prisma.heroImage.create({
        data: {
          imageUrl,
          heading: heading || 'Welcome to My Music.',
          subheading: subheading || 'Exclusive tracks, lyrics, and stories',
          overlayColor: overlayColor || '#000000',
          overlayOpacity: overlayOpacity ? parseFloat(overlayOpacity) : 0.65,
          primaryBtnText: primaryBtnText || 'Listen Now',
          primaryBtnLink: primaryBtnLink || '/songs',
          secondaryBtnText: secondaryBtnText || 'View Lyrics',
          secondaryBtnLink: secondaryBtnLink || '/lyrics',
          textColor: textColor || 'white',
          textShadow: textShadow === 'true' || textShadow === true || false,
          imageFit: imageFit || 'cover',
          imageOpacity: imageOpacity ? parseFloat(imageOpacity) : 1,
          blur: blur ? parseInt(blur, 10) : 0,
          brightness: brightness ? parseFloat(brightness) : 1,
          contrast: contrast ? parseFloat(contrast) : 1,
          enabled: enabled === 'true' || enabled === true || true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hero configuration created successfully',
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
        error: error.message || 'Failed to create hero configuration',
      });
    }
  }
);

/**
 * PUT /hero/:id
 * Update hero configuration (admin only)
 */
router.put(
  '/:id',
  ipAuth,
  adminAuth,
  upload.single('heroImage'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        heading,
        subheading,
        overlayColor,
        overlayOpacity,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        textColor,
        textShadow,
        imageFit,
        imageOpacity,
        blur,
        brightness,
        contrast,
        enabled,
      } = req.body;

      // Find existing hero
      const existingHero = await prisma.heroImage.findUnique({
        where: { id },
      });

      if (!existingHero) {
        return res.status(404).json({
          success: false,
          error: 'Hero configuration not found',
        });
      }

      let updateData = {};

      // Update text/style fields
      if (heading !== undefined) updateData.heading = heading;
      if (subheading !== undefined) updateData.subheading = subheading;
      if (overlayColor !== undefined) updateData.overlayColor = overlayColor;
      if (overlayOpacity !== undefined) updateData.overlayOpacity = parseFloat(overlayOpacity);
      if (primaryBtnText !== undefined) updateData.primaryBtnText = primaryBtnText;
      if (primaryBtnLink !== undefined) updateData.primaryBtnLink = primaryBtnLink;
      if (secondaryBtnText !== undefined) updateData.secondaryBtnText = secondaryBtnText;
      if (secondaryBtnLink !== undefined) updateData.secondaryBtnLink = secondaryBtnLink;
      if (textColor !== undefined) updateData.textColor = textColor;
      if (textShadow !== undefined) updateData.textShadow = textShadow === 'true' || textShadow === true;
      if (imageFit !== undefined) updateData.imageFit = imageFit;
      if (imageOpacity !== undefined) updateData.imageOpacity = parseFloat(imageOpacity);
      if (blur !== undefined) updateData.blur = parseInt(blur, 10);
      if (brightness !== undefined) updateData.brightness = parseFloat(brightness);
      if (contrast !== undefined) updateData.contrast = parseFloat(contrast);
      if (enabled !== undefined) updateData.enabled = enabled === 'true' || enabled === true;

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
        message: 'Hero configuration updated successfully',
        data: updatedHero,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update hero configuration',
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
