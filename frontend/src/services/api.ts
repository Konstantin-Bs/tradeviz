import type { Snapshot, BarsResponse } from "../types/types";

export async function getStocks(): Promise<Snapshot[]> {
  const data = await fetch(import.meta.env.VITE_API_URL + "/stocks");
  return data.json();
}

export async function getBars(ticker: string): Promise<BarsResponse> {
  const data = await fetch(import.meta.env.VITE_API_URL + `/bars/${ticker}`);
  return data.json();
}
