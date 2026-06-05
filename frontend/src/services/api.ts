import type { Snapshot, BarsResponse } from "../types/types";

export async function getStocks(): Promise<Snapshot[]> {
  try {
    const data = await fetch(import.meta.env.VITE_API_URL + "/stocks");
    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }
    return data.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getBars(
  ticker: string,
  period: string,
): Promise<BarsResponse> {
  try {
    const data = await fetch(
      import.meta.env.VITE_API_URL + `/bars/${ticker}?period=${period}`,
    );
    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }
    return data.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
}
