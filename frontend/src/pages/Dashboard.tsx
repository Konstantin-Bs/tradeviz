import { useState, useEffect } from "react";
import { getStocks } from "../services/api";
import type { Snapshot } from "../types/types";
import { useNavigate } from "react-router-dom";

export default function Dashboard({
  prices,
}: {
  prices: Record<string, number>;
}) {
  const [stock, setStock] = useState<Snapshot[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStocks() {
      const data = await getStocks();
      setStock(data);
    }
    fetchStocks();
  }, []);

  return (
    <div>
      {stock.map((stocks) => {
        const livePrice = prices[stocks.ticker] ?? stocks.price;
        const liveChange = parseFloat(
          (livePrice - stocks.prev_close).toFixed(2),
        );
        const liveChangePercent = parseFloat(
          ((liveChange / stocks.prev_close) * 100).toFixed(2),
        );

        return (
          <div
            key={stocks.ticker}
            className="flex flex-row gap-2 border rounded-md"
            onClick={() => navigate(`/stock/${stocks.ticker}`)}
          >
            <p>{stocks.ticker}</p>
            <p>{livePrice}</p>
            <p>{stocks.timestamp}</p>
            <p>{stocks.open_price}</p>
            <p>{liveChange}</p>
            <p>{liveChangePercent}</p>
            <p>{stocks.volume}</p>
          </div>
        );
      })}
    </div>
  );
}
