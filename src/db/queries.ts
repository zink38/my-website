import type { ResultSetHeader } from "mysql2";
import pool from "./connection.js";

// SELECT
export async function SelectQuery<T>(
  queryString: string, params?: any[]
): Promise<Partial<T>[]> {
  const [results] = await pool.execute(queryString, params);
  return results as T[];
}

// INSERT / UPDATE / DELETE
export async function ModifyQuery(
  queryString: string, params?: any[]
): Promise<ResultSetHeader> {
  const [results] = await pool.execute(queryString, params);
  return results as ResultSetHeader;
}
