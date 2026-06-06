import { useState, useEffect, useMemo } from "react";
import { getStocks } from "../services/api";
import type { Snapshot } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Dashboard({
  prices,
}: {
  prices: Record<string, number>;
}) {
  const [stock, setStock] = useState<Snapshot[]>([]);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stocksLoading, setStocksLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const data = await getStocks();
        setStock(data);
        setStocksLoading(false);
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
    <div className="flex flex-col items-center my-10">
      <div className="relative my-3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          className="pl-9 pr-4 py-2 rounded-lg border border-gray-600 bg-mist-800"
          type="text"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {filteredStocks.length > 0 && !stocksLoading && (
        <div className="rounded-lg border border-gray-600 mx-auto w-full max-w-4xl">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-2 text-center border-b border-r border-gray-600">
                  Symbol
                </th>
                <th className="p-2 text-left border-b border-gray-600">Name</th>
                <th className="p-2 text-left border-b border-gray-600">
                  Price
                </th>
                <th className="p-2 text-left border-b border-gray-600">
                  change
                </th>
                <th className="p-2 text-left border-b border-gray-600">
                  Change %
                </th>
                <th className="p-2 text-left border-b border-gray-600">
                  Volume
                </th>
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
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        navigate(`/stock/${stocks.ticker}`, { state: stocks });
                    }}
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
      )}
      {stocksLoading && (
        <div className="rounded-lg border border-gray-600 mx-auto w-full max-w-4xl animate-pulse">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-3 border-b border-r border-gray-600">
                  <div className="h-4 w-12 bg-gray-700 rounded mx-auto" />
                </th>
                <th className="p-3 border-b border-gray-600">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                </th>
                <th className="p-3 border-b border-gray-600">
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </th>
                <th className="p-3 border-b border-gray-600">
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </th>
                <th className="p-3 border-b border-gray-600">
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </th>
                <th className="p-3 border-b border-gray-600">
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-3 border-b border-r border-gray-600">
                    <div className="h-4 w-12 bg-gray-700 rounded mx-auto" />
                  </td>
                  <td className="p-3 border-b border-gray-600">
                    <div className="h-4 w-32 bg-gray-700 rounded" />
                  </td>
                  <td className="p-3 border-b border-gray-600">
                    <div className="h-4 w-16 bg-gray-700 rounded" />
                  </td>
                  <td className="p-3 border-b border-gray-600">
                    <div className="h-4 w-16 bg-gray-700 rounded" />
                  </td>
                  <td className="p-3 border-b border-gray-600">
                    <div className="h-4 w-16 bg-gray-700 rounded" />
                  </td>
                  <td className="p-3 border-b border-gray-600">
                    <div className="h-4 w-16 bg-gray-700 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filteredStocks.length === 0 && query && (
        <p className="my-5">No results for "{query}"</p>
      )}
    </div>
  );
}
