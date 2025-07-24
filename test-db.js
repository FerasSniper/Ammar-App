// Test database connection with environment loading
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Environment variables:');
    console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
    console.log('MYSQL_PORT:', process.env.MYSQL_PORT);
    console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
    console.log('MYSQL_USER:', process.env.MYSQL_USER);
    console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '[SET]' : '[NOT SET]');

    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'training_test',
    });

    // Test basic connection
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', rows);

    // Test users table
    try {
      const [users] = await pool.execute('SELECT * FROM users LIMIT 1');
      console.log('✅ Users table accessible!');
      console.log('Sample user data:', users);
    } catch (tableError) {
      console.log('❌ Users table error:', tableError.message);
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
