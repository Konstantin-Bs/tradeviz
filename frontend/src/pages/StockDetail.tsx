import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { BarsResponse } from "../types/types";
import { getBars } from "../services/api";
import { CandlestickSeries, createChart, LineSeries } from "lightweight-charts";

export default function StockDetail() {
  const [bars, setBars] = useState<BarsResponse | null>();
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
    if (!chartRef.current || !bars) return;
    const chart = createChart(chartRef.current);
    const candlestickSeries = chart.addSeries(CandlestickSeries);
    candlestickSeries.setData(bars.bars);
    const lineSeries = chart.addSeries(LineSeries);
    const lsdata = bars.bars
      .filter((bar) => bar.ma !== null)
      .map((bar) => ({ time: bar.time, value: bar.ma }));
    lineSeries.setData(lsdata);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [bars]);

  return (
    <div>
      <div className="h-96" ref={chartRef} />
      <p>52W High: {bars?.week52_high}</p>
      <p>52W Low: {bars?.week52_low}</p>
    </div>
  );
}
