import { useEffect, useState } from "react";

export default function useWebSocket() {
  const [price, setPrice] = useState<Record<string, number>>({});
  const [retryCount, setRetryCount] = useState(0);
  const url = "ws://localhost:8000/ws";

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const trades = data.filter((msg: any) => msg.T === "t");
      trades.forEach((msg: any) => {
        setPrice((prev) => ({ ...prev, [msg.S]: msg.p }));
      });
    };
    ws.onclose = () => {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 5000);
    };
    return () => ws.close();
  }, [retryCount]);

  return price;
}
