export async function getStocks(): Promise<string[]> {
  const data = await fetch(import.meta.env.VITE_API_URL + "/stocks");
  return data.json();
}
