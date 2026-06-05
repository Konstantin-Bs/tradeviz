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

  function formatVolume(volume: number): string {
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(3)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(3)}K`;
    return volume.toString();
  }

  const filteredStocks = useMemo(() => {
    return stock.filter(
      (s) =>
        s.ticker.includes(query.toUpperCase()) ||
        s.company_name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [stock, query]);

  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center">
      <div className="p-3">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="rounded-lg border border-gray-600 mx-auto w-full max-w-4xl">
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-2 text-center border-b border-r border-gray-600">
                Symbol
              </th>
              <th className="p-2 text-left border-b border-gray-600">Name</th>
              <th className="p-2 text-left border-b border-gray-600">Price</th>
              <th className="p-2 text-left border-b border-gray-600">change</th>
              <th className="p-2 text-left border-b border-gray-600">
                Change %
              </th>
              <th className="p-2 text-left border-b border-gray-600">Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stocks) => {
              const livePrice = prices[stocks.ticker] ?? stocks.price;
              const liveChange = parseFloat(
                (livePrice - stocks.prev_close).toFixed(2),
              );
              const liveChangePercent = parseFloat(
                ((liveChange / stocks.prev_close) * 100).toFixed(2),
              );

              return (
                <tr
                  className="cursor-pointer hover:bg-mist-800"
                  key={stocks.ticker}
                  onClick={() =>
                    navigate(`/stock/${stocks.ticker}`, { state: stocks })
                  }
                >
                  <td className="p-2 text-center border-b border-r border-gray-600">
                    {stocks.ticker}
                  </td>
                  <td className="p-2 text-left border-b border-gray-600">
                    {stocks.company_name}
                  </td>
                  <td className="p-2 text-left border-b border-gray-600">
                    ${livePrice}
                  </td>
                  {liveChange > 0 ? (
                    <td className="p-2 text-left border-b border-gray-600 text-green-400">
                      +${liveChange}
                    </td>
                  ) : (
                    <td className="p-2 text-left border-b border-gray-600 text-red-400">
                      -${Math.abs(liveChange)}
                    </td>
                  )}
                  {liveChangePercent > 0 ? (
                    <td className="p-2 text-left border-b border-gray-600 text-green-400">
                      +{liveChangePercent}%
                    </td>
                  ) : (
                    <td className="p-2 text-left border-b border-gray-600 text-red-400">
                      {liveChangePercent}%
                    </td>
                  )}
                  <td className="p-2 text-left border-b border-gray-600">
                    {formatVolume(stocks.volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
