import { useState, useEffect } from "react";
import { getStocks } from "../services/api";
import type { Snapshot } from "../types/types";

export default function Dashboard() {
  const [stock, setStock] = useState<Snapshot[]>([]);

  useEffect(() => {
    async function fetchStocks() {
      const data = await getStocks();
      setStock(data);
    }
    fetchStocks();
  }, []);

  return (
    <div>
      {stock.map((stocks) => (
        <div
          key={stocks.ticker}
          className="flex flex-row gap-2 border rounded-md"
        >
          <p>{stocks.ticker}</p>
          <p>{stocks.price}</p>
          <p>{stocks.timestamp}</p>
          <p>{stocks.open_price}</p>
          <p>{stocks.change}</p>
          <p>{stocks.change_percentage}</p>
          <p>{stocks.volume}</p>
        </div>
      ))}
    </div>
  );
}
