import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { BarsResponse, Snapshot } from "../types/types";
import { getBars } from "../services/api";
import {
  CandlestickSeries,
  createChart,
  HistogramSeries,
  LineSeries,
  CrosshairMode,
  LineStyle,
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!snapshot) navigate("/");
  }, [snapshot]);

  useEffect(() => {
    document.title = `${ticker} - tradeviz`;
    return () => {
      document.title = "tradeviz";
    };
  }, [ticker]);

  useEffect(() => {
    async function fetchBars() {
      if (!ticker) return;
      try {
        const data = await getBars(ticker, period);
        setBars(data);
      } catch (err) {
        if (period === "1D") {
          setError("No data available for today — market may be closed");
        } else {
          setError("Failed to load stocks");
        }
      }
    }
    fetchBars();
  }, [ticker, period]);

  useEffect(() => {
    if (!chartRef.current || !bars || bars.bars.length === 0) return;
    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: "#111827" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
    });
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

    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 4,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "#9B7DFF",
        },
        horzLine: {
          color: "#9B7DFF",
          labelBackgroundColor: "#9B7DFF",
        },
      },
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartRef.current?.clientWidth });
      chart.timeScale().fitContent();
    };
    window.addEventListener("resize", handleResize);

    chart.timeScale().fitContent();
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
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

  function formatVolume(volume: number): string {
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(3)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(3)}K`;
    return volume.toString();
  }

  const livePrice = prices[snapshot.ticker] ?? snapshot.price;
  const liveChange = parseFloat((livePrice - snapshot.prev_close).toFixed(2));
  const liveChangePercent = parseFloat(
    ((liveChange / snapshot.prev_close) * 100).toFixed(2),
  );

  if (error)
    return (
      <div className="mt-20 flex flex-col items-center gap-4">
        <p className="text-red-400">{error}</p>
        <div className="flex flex-row gap-1 bg-gray-800 rounded-lg p-1">
          {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setError(null);
              }}
              className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer text-gray-400 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="mt-15 flex flex-col">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-semibold text-5xl">
          {snapshot.ticker} | {snapshot.company_name}
        </h1>
        <div className="flex flex-row items-center gap-4">
          <p className="text-2xl font-bold">${livePrice}</p>
          <p
            className={`text-lg ${liveChange > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {liveChange > 0 ? `+$${liveChange}` : `-$${Math.abs(liveChange)}`}
          </p>
          <p
            className={`text-lg ${liveChangePercent > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {liveChangePercent > 0
              ? `+${liveChangePercent}%`
              : `${liveChangePercent}%`}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-1 p-1 self-end">
        {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              period === p
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      {bars ? (
        <div className="h-140" ref={chartRef} />
      ) : (
        <div className="h-140 rounded-lg bg-gray-800 animate-pulse" />
      )}
      <div className="flex flex-row flex-wrap items-center justify-center gap-10 my-5">
        <div className="border-r pr-10">
          <p className="text-xs text-gray-400">Daily Open</p>
          <p className="font-semibold">
            ${bars?.bars[bars.bars.length - 1].open}
          </p>
        </div>
        <div className="border-r pr-10">
          <p className="text-xs text-gray-400">Prev Close:</p>
          <p className="font-semibold">{snapshot.prev_close}</p>
        </div>
        <div className="border-r pr-10">
          <p className="text-xs text-gray-400">52W High:</p>
          <p className="font-semibold">{bars?.week52_high}</p>
        </div>
        <div className="border-r pr-10">
          <p className="text-xs text-gray-400">52W Low:</p>
          <p className="font-semibold">{bars?.week52_low}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Volume:</p>
          <p className="font-semibold">{formatVolume(snapshot.volume)}</p>
        </div>
      </div>
    </div>
  );
}
