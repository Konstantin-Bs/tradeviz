import { useState, useEffect } from "react";
import { getStocks } from "./services/api";

export default function () {
  const [stocks, setStocks] = useState<string[]>([]);

  useEffect(() => {
    async function fetchStocks() {
      const data = await getStocks();
      setStocks(data);
    }
    fetchStocks();
  }, []);

  return (
    <div>
      {stocks.map((ticker) => (
        <p key={ticker}>{ticker}</p>
      ))}
    </div>
  );
}
