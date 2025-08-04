// services/BinanceWebSocketService.ts
import { useEffect, useMemo, useRef, useState } from "react";

export type BinanceKline = {
    t: number; // open time
    o: string; // open
    h: string; // high
    l: string; // low
    c: string; // close
    v: string; // volume
    T: number; // close time
    x: boolean; // is this kline closed?
};

export function subscribeBinanceKline(
    symbol: string,
    interval: string,
    onKline: (kline: BinanceKline) => void
) {
    const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    );

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.k) {
            onKline(data.k);
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
        console.log("WebSocket closed");
    };

    return ws;
}

export type Order = [string, string]; // [price, quantity]

export interface OrderBookData {
    bids: Order[];
    asks: Order[];
    spread: number | null;
    percentSpread: number | null;
}

export function useOrderBook(
    symbol: string = "btcusdt",
    level: number = 10
): OrderBookData {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        setBids([]);
        setAsks([]);

        const stream = `${symbol.toLowerCase()}@depth${level}`;
        const url = `wss://stream.binance.com:9443/ws/${stream}`;
        ws.current = new WebSocket(url);

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Bids/Ask: ", data);
            if (data.bids) setBids(data.bids);
            if (data.asks) setAsks(data.asks);
        };

        return () => {
            ws.current?.close();
        };
    }, [symbol, level]);

    const spread = useMemo(() => {
        if (bids.length === 0 || asks.length === 0) return null;
        const bestBid = parseFloat(bids[0][0]);
        const bestAsk = parseFloat(asks[0][0]);
        return bestAsk - bestBid;
    }, [bids, asks]);

    const percentSpread = useMemo(() => {
        if (spread === null || asks.length === 0) return null;
        const bestAsk = parseFloat(asks[0][0]);
        return (spread / bestAsk) * 100;
    }, [spread, asks]);

    return { bids, asks, spread, percentSpread };
}

export interface Trade {
    tradeId: number;
    price: number;
    quantity: number;
    timestamp: number;
    isBuyerMaker: boolean;
}

export const useTradeStream = (symbol: string, maxTrades = 50) => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!symbol) return;

        const lowerSymbol = symbol.toLowerCase();
        const url = `wss://stream.binance.com:9443/ws/${lowerSymbol}@trade`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newTrade: Trade = {
                tradeId: data.t,
                price: parseFloat(data.p),
                quantity: parseFloat(data.q),
                timestamp: data.T,
                isBuyerMaker: data.m,
            };

            setTrades((prev) => {
                const updated = [newTrade, ...prev];
                return updated.slice(0, maxTrades);
            });
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.warn("Trade WebSocket closed. Attempting reconnect...");
        };

        return () => {
            ws.close();
        };
    }, [symbol]);

    return trades;
};

export interface MarketStats {
    markPrice: number;
    fundingRate: number;
    nextFundingTime: number;
    priceChangePercent: number;
    volume: number;
    openInterest: number;
}

export function useMarketStats(symbol: string): MarketStats | null {
    const [data, setData] = useState<MarketStats | null>(null);

    useEffect(() => {
        if (!symbol) return;

        const fetchStats = async () => {
            try {
                const [premiumRes, statsRes, oiRes] = await Promise.all([
                    fetch(
                        `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`
                    ),
                    fetch(
                        `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`
                    ),
                    fetch(
                        `https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`
                    ),
                ]);

                const premium = await premiumRes.json();
                const stats = await statsRes.json();
                const oi = await oiRes.json();

                setData({
                    markPrice: parseFloat(premium.markPrice),
                    fundingRate: parseFloat(premium.lastFundingRate),
                    nextFundingTime: premium.nextFundingTime,
                    priceChangePercent: parseFloat(stats.priceChangePercent),
                    volume: parseFloat(stats.volume),
                    openInterest: parseFloat(oi.openInterest),
                });
            } catch (error) {
                console.error("Failed to fetch market stats:", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 1000); // every 1s

        return () => clearInterval(interval);
    }, [symbol]);

    return data;
}
