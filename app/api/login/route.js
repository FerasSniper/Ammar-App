// app/api/login/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    // Test connection
    await pool.query('SELECT 1');

    // Lookup user
    const [rows] = await pool.query(
      'SELECT id, name, password, mobile FROM users WHERE name = ?',
      [name]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return NextResponse.json({ message: 'Invalid user or password' }, { status: 401 });
    }

    const user = rows[0];
    return NextResponse.json({ id: user.id, name: user.name, mobile: user.mobile });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Optional: block other methods
export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
