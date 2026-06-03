import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Bar } from "../types/types";
import { getBars } from "../services/api";
import { CandlestickSeries, createChart, LineSeries } from "lightweight-charts";

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
    const lineSeries = chart.addSeries(LineSeries);
    const lsdata = bars
      .filter((bar) => bar.ma !== null)
      .map((bar) => ({ time: bar.time, value: bar.ma }));
    lineSeries.setData(lsdata);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [bars]);

  return <div className="h-96" ref={chartRef} />;
}
