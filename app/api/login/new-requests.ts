// pages/api/new-requests.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost', // Replace with your phpMyAdmin host
  user: 'root', // Replace with your phpMyAdmin username
  password: '', // Replace with your phpMyAdmin password
  database: 'training_test', // Replace with your database name
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [rows] = await connection.query('SELECT * FROM new_requests');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch new requests' });
  }
}