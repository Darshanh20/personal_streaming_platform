import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Route imports
import adminRoutes from './routes/admin.js';
import songsRoutes from './routes/songs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// ========== MIDDLEWARE ==========

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ========== HEALTH CHECK ROUTES ==========

app.get('/api/health', (req, res) => {
  res.json({ message: '🎵 Backend is running!' });
});

/**
 * Database connection test endpoint
 */
app.get('/api/db-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const userCount = await prisma.user.count();
    const adminCount = await prisma.admin.count();
    const songCount = await prisma.song.count();

    res.json({
      success: true,
      message: 'Database connection is working!',
      stats: {
        users: userCount,
        admins: adminCount,
        songs: songCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + error.message,
    });
  }
});

// ========== ROUTE REGISTRATION ==========

// Admin routes (upload songs)
app.use('/api/admin', adminRoutes);

// Public song routes (get songs)
app.use('/api/songs', songsRoutes);

// ========== LEGACY ROUTES (for backward compatibility) ==========

app.get('/api/data', (req, res) => {
  res.json({
    data: 'Sample data from backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, avatarUrl } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    const user = await prisma.user.create({
      data: { name, email, avatarUrl },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/admins', async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        songs: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });
    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== ERROR HANDLING ==========

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ========== 404 HANDLER ==========

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// ========== SERVER STARTUP ==========

const server = app.listen(PORT, () => {
  console.log('\n🎵 ========== MUSIC PLATFORM BACKEND ==========');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('\n📝 Available Endpoints:');
  console.log('   Health Check:');
  console.log(`     GET http://localhost:${PORT}/api/health`);
  console.log(`     GET http://localhost:${PORT}/api/db-test`);
  console.log('\n   Admin Routes (requires x-admin-key header):');
  console.log(`     POST http://localhost:${PORT}/api/admin/upload`);
  console.log('\n   Public Song Routes:');
  console.log(`     GET http://localhost:${PORT}/api/songs`);
  console.log(`     GET http://localhost:${PORT}/api/songs/:id`);
  console.log('\n   User Routes:');
  console.log(`     GET http://localhost:${PORT}/api/users`);
  console.log(`     POST http://localhost:${PORT}/api/users`);
  console.log('\n   Admin Routes (read):');
  console.log(`     GET http://localhost:${PORT}/api/admins`);
  console.log('\n🔐 Admin Key: ' + (process.env.ADMIN_SECRET || 'NOT SET'));
  console.log('============================================\n');
});

// ========== GRACEFUL SHUTDOWN ==========

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  server.close();
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  server.close();
});

export default app;
