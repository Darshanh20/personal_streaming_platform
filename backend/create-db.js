const { Client } = require('pg');

async function createDatabase() {
  // First connect to default 'postgres' database to create our database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'postgres'
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const result = await client.query(
      "SELECT datname FROM pg_database WHERE datname = 'music_platform';"
    );

    if (result.rows.length > 0) {
      console.log('✅ Database "music_platform" already exists');
    } else {
      console.log('Creating database "music_platform"...');
      await client.query('CREATE DATABASE music_platform;');
      console.log('✅ Database "music_platform" created successfully');
    }

    await client.end();
    console.log('\n✅ Database setup complete!');
    console.log('Now run: npm run db:setup');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  If password is wrong, update .env with correct PostgreSQL credentials');
    process.exit(1);
  }
}

createDatabase();
