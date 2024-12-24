import type { ResultSetHeader } from "mysql2";
import pool from "./connection.js";

// SELECT
export async function SelectQuery<T>(
  queryString: string
): Promise<Partial<T>[]> {
  const [results] = await pool.execute(queryString);
  return results as T[];
}

// INSERT / UPDATE / DELETE
export async function ModifyQuery(
  queryString: string
): Promise<ResultSetHeader> {
  const [results] = await pool.execute(queryString);
  return results as ResultSetHeader;
}
