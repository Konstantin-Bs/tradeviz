import { useState, useEffect, useMemo } from "react";
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
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const data = await getStocks();
        setStock(data);
      } catch (err) {
        setError("Failed to load stocks");
      }
    }
    fetchStocks();
  }, []);

  const filteredStocks = useMemo(() => {
    return stock.filter(
      (s) =>
        s.ticker.includes(query.toUpperCase()) ||
        s.company_name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [stock, query]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div>
        {filteredStocks.map((stocks) => {
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
              onClick={() =>
                navigate(`/stock/${stocks.ticker}`, { state: stocks })
              }
            >
              <p>{stocks.ticker}</p>
              <p>{stocks.company_name}</p>
              <p>{livePrice}</p>
              <p>{liveChange}</p>
              <p>{liveChangePercent}</p>
              <p>{stocks.volume}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
