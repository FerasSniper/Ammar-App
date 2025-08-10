import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'training_test', 
});

export async function GET() {
  try {
    const [rows] = await connection.query('SELECT * FROM new_requests') as [RowDataPacket[], any];
    
    // Debug: Log the raw database structure
    console.log('Raw database rows:', rows);
    
    // Map database fields to match dashboard expectations
    const mappedRows = rows.map((row: any) => {
      // Common date field mappings
      const registeredAt = row.registered || row.registeredAt || row.registered_at || row.created_at || 
                          row.date_created || row.registration_date || row.created_date ||
                          row.date || row.timestamp || 'N/A';
      
      return {
        id: row.id?.toString() || '',
        name: row.name || row.full_name || row.first_name || '',
        mobile: row.mobile || row.phone || row.phone_number || '',
        email: row.email || row.email_address || '',
        registeredAt: registeredAt
      };
    });
    
    console.log('Mapped rows:', mappedRows);
    return NextResponse.json(mappedRows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new requests' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientIds } = body;
    
    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json(
        { error: 'Client IDs are required' },
        { status: 400 }
      );
    }
    
    // Create placeholders for the IN clause
    const placeholders = clientIds.map(() => '?').join(',');
    const query = `DELETE FROM new_requests WHERE id IN (${placeholders})`;
    
    const [result] = await connection.query(query, clientIds);
    
    console.log('Delete result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${clientIds.length} client(s)`,
      deletedIds: clientIds
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete clients' },
      { status: 500 }
    );
  }
}
