import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;

// Use environment variables for database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add error handling for unexpected connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add connection success logging
pool.on('connect', () => {
  console.log('Database connected successfully');
});

export const db = drizzle(pool);
