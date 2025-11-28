import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed...');
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create default admin user
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash: passwordHash,
      },
    });

    console.log('✅ Default admin user created:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   ID: ${admin.id}`);
    console.log('\n⚠️  IMPORTANT: Change the default password immediately!');

    // Create sample user
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    });

    console.log('\n✅ Sample user created:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);

    // Create sample song
    const song = await prisma.song.create({
      data: {
        title: 'Sample Song',
        description: 'This is a sample song for testing',
        audioUrl: 'https://example.com/audio.mp3',
        coverUrl: 'https://example.com/cover.jpg',
        lyricsUrl: 'https://example.com/lyrics.txt',
        tags: ['sample', 'test', 'music'],
        duration: 240, // 4 minutes
        uploadedBy: {
          connect: { id: admin.id },
        },
      },
    });

    console.log('\n✅ Sample song created:');
    console.log(`   Title: ${song.title}`);
    console.log(`   ID: ${song.id}`);
    console.log(`   Uploaded by: ${admin.username}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
