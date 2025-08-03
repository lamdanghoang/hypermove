// services/BinanceRestService.ts
export interface BinanceKlineRest {
    time: number; // timestamp (seconds)
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export async function fetchBinanceKlines(
    symbol: string,
    interval: string,
    limit = 500
) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    const history: BinanceKlineRest[] = data.map((item: any[]) => ({
        time: Math.floor(item[0] / 1000),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
    }));

    return history;
}
