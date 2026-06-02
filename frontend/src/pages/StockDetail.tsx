import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Bar } from "../types/types";
import { getBars } from "../services/api";
import { CandlestickSeries, createChart } from "lightweight-charts";

export default function StockDetail() {
  const [bars, setBars] = useState<Bar[]>([]);
  const { ticker } = useParams();
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchBars() {
      if (!ticker) return;
      const data = await getBars(ticker);
      setBars(data);
    }
    fetchBars();
  }, [ticker]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current);
    const candlestickSeries = chart.addSeries(CandlestickSeries);
    candlestickSeries.setData(bars);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [bars]);

  return <div className="h-96" ref={chartRef} />;
}
