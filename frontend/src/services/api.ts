import type { Snapshot } from "../types/types";

export async function getStocks(): Promise<Snapshot[]> {
  const data = await fetch(import.meta.env.VITE_API_URL + "/stocks");
  return data.json();
}
