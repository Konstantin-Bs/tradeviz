import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { BarsResponse, Snapshot } from "../types/types";
import { getBars } from "../services/api";
import {
  CandlestickSeries,
  createChart,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";

export default function StockDetail({
  prices,
}: {
  prices: Record<string, number>;
}) {
  const [bars, setBars] = useState<BarsResponse | null>();
  const { ticker } = useParams();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const snapshot = location.state as Snapshot;

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

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
    });
    const vsdata = bars.bars.map((bar) => ({
      time: bar.time,
      value: bar.volume,
      color:
        bar.close >= bar.open
          ? "rgba(0, 150, 136, 0.5)"
          : "rgba(255, 82, 82, 0.5)",
    }));
    volumeSeries.setData(vsdata);
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [bars]);

  const livePrice = prices[snapshot.ticker] ?? snapshot.price;
  const liveChange = parseFloat((livePrice - snapshot.prev_close).toFixed(2));
  const liveChangePercent = parseFloat(
    ((liveChange / snapshot.prev_close) * 100).toFixed(2),
  );

  return (
    <div>
      <h1>
        {snapshot.ticker} {snapshot.company_name}
      </h1>
      <div>
        <p>Current Price: {livePrice}</p>
        <p>Change: {liveChange}</p>
        <p>Change %: {liveChangePercent}</p>
      </div>
      <div className="h-140" ref={chartRef} />
      <div>
        <p>Daily Open: {bars?.bars[bars.bars.length - 1].open}</p>
        <p>Prev Close: {snapshot.prev_close}</p>
        <p>52W High: {bars?.week52_high}</p>
        <p>52W Low: {bars?.week52_low}</p>
        <p>Volume: {snapshot.volume}</p>
      </div>
    </div>
  );
}
