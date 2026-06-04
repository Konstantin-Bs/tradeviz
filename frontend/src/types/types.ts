export interface Snapshot {
  ticker: string;
  price: number;
  prev_close: number;
  volume: number;
  company_name: string;
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
  volume: number;
  ma: number | null;
}
