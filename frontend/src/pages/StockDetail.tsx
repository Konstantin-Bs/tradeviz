import { useLocation, useParams, useNavigate } from "react-router-dom";
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
  const [bars, setBars] = useState<BarsResponse | null>(null);
  const { ticker } = useParams();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const currentCandleRef = useRef<any>(null);
  const location = useLocation();
  const snapshot = location.state as Snapshot;
  const [period, setPeriod] = useState("1Y");
  const navigate = useNavigate();

  useEffect(() => {
    if (!snapshot) navigate("/");
  }, [snapshot]);

  useEffect(() => {
    async function fetchBars() {
      if (!ticker) return;
      const data = await getBars(ticker, period);
      setBars(data);
    }
    fetchBars();
  }, [ticker, period]);

  useEffect(() => {
    if (!chartRef.current || !bars) return;
    const chart = createChart(chartRef.current);
    const candlestickSeries = chart.addSeries(CandlestickSeries);
    candlestickSeries.setData(bars.bars);
    currentCandleRef.current = bars.bars[bars.bars.length - 1];
    candlestickSeriesRef.current = candlestickSeries;

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

  useEffect(() => {
    if (
      period === "1D" &&
      candlestickSeriesRef.current &&
      ticker &&
      prices[ticker]
    ) {
      const newHigh = Math.max(currentCandleRef.current.high, prices[ticker]);
      const newLow = Math.min(currentCandleRef.current.low, prices[ticker]);
      const now = Math.floor(Date.now() / 1000);
      const minuteTimestamp = now - (now % 60);

      candlestickSeriesRef.current.update({
        time: minuteTimestamp,
        open: currentCandleRef.current.open,
        high: newHigh,
        low: newLow,
        close: prices[ticker],
      });
      currentCandleRef.current = {
        ...currentCandleRef.current,
        high: newHigh,
        low: newLow,
        close: prices[ticker],
      };
    }
  }, [prices]);

  const livePrice = prices[snapshot.ticker] ?? snapshot.price;
  const liveChange = parseFloat((livePrice - snapshot.prev_close).toFixed(2));
  const liveChangePercent = parseFloat(
    ((liveChange / snapshot.prev_close) * 100).toFixed(2),
  );

  return (
    <div>
      <div>
        <h1>
          {snapshot.ticker} {snapshot.company_name}
        </h1>
        <div>
          <p>Current Price: {livePrice}</p>
          <p>Change: {liveChange}</p>
          <p>Change %: {liveChangePercent}</p>
        </div>
      </div>
      <div>
        <button onClick={() => setPeriod("1D")}>1D</button>
        <button onClick={() => setPeriod("1W")}>1W</button>
        <button onClick={() => setPeriod("1M")}>1M</button>
        <button onClick={() => setPeriod("3M")}>3M</button>
        <button onClick={() => setPeriod("1Y")}>1Y</button>
        <button onClick={() => setPeriod("5Y")}>5Y</button>
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
