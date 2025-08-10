// app/api/register-info/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// MySQL connection pool
const connection = mysql.createPool({
  host: 'localhost',      // Your MySQL host
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password
  database: 'training_test', // Your database name
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing client ID' }, { status: 400 });
  }

  try {
    // First, try to get data from register_info table
    const [registerRows] = await connection.query(
      `SELECT 
        name, 
        nick_name AS nickName,
        mobile,
        email,
        job,
        plot_address AS plotAddress,
        plot_area AS plotArea,
        design_type AS designType,
        preferred_offer AS preferredOffer,
        know_us_through AS knowUsThrough,
        basement,
        ground_floor AS groundFloor,
        first_floor AS firstFloor,
        second_floor AS secondFloor,
        rooftop,
        total_building_area AS buildingArea,
        design_description AS designDescription
      FROM register_info 
      WHERE client_id = ? 
      LIMIT 1`,
      [id]
    ) as [RowDataPacket[], any];

    if (registerRows.length > 0) {
      return NextResponse.json(registerRows[0]);
    } else {
      // If no register_info found, get basic info from new_requests table
      const [requestRows] = await connection.query(
        `SELECT 
          name, 
          mobile,
          email,
          '' AS nickName,
          '' AS job,
          '' AS plotAddress,
          '' AS plotArea,
          '' AS designType,
          '' AS preferredOffer,
          '' AS knowUsThrough,
          '' AS basement,
          '' AS groundFloor,
          '' AS firstFloor,
          '' AS secondFloor,
          '' AS rooftop,
          '' AS buildingArea,
          '' AS designDescription
        FROM new_requests 
        WHERE id = ? 
        LIMIT 1`,
        [id]
      ) as [RowDataPacket[], any];

      if (requestRows.length > 0) {
        return NextResponse.json(requestRows[0]);
      } else {
        return NextResponse.json({ error: 'No user found with this ID' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Server error fetching register info' }, { status: 500 });
  }
}
