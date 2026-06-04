export interface Snapshot {
  ticker: string;
  price: number;
  timestamp: string;
  open_price: number;
  prev_close: number;
  volume: number;
}

export interface BarsResponse {
  bars: Bar[];
  week52_high: number;
  week52_low: number;
}

export interface Bar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma: number | null;
}
