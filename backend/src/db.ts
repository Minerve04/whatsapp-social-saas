import pg from "pg";
import { config } from "./config.js";

// Pool Postgres partagé. Le backend utilise une connexion directe (service),
// contrairement au portail qui passe par Supabase + RLS.
export const pool = new pg.Pool({ connectionString: config.databaseUrl });

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await pool.query<T>(text, params as any[]);
  return res.rows;
}
