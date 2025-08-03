// services/TradingDataService.ts
export interface OrderBookLevel {
    price: number;
    size: number;
    total: number;
    count: number;
}

export interface Trade {
    id: string;
    price: number;
    size: number;
    side: "buy" | "sell";
    timestamp: number;
}

export interface MarketData {
    symbol: string;
    markPrice: number;
    oraclePrice: number;
    priceChange24h: number;
    priceChangePercent24h: number;
    volume24h: number;
    openInterest: number;
    fundingRate: number;
    nextFundingTime: number;
}

export interface AccountBalance {
    asset: string;
    total: number;
    available: number;
    locked: number;
    usdValue: number;
}

export interface Position {
    symbol: string;
    side: "long" | "short";
    size: number;
    entryPrice: number;
    markPrice: number;
    pnl: number;
    pnlPercent: number;
    liquidationPrice: number;
    margin: number;
    leverage: number;
}

export interface OrderBookData {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    spread: number;
    lastUpdateId: number;
}

function orderSideToPositionSide(side: "buy" | "sell"): "long" | "short" {
    return side === "buy" ? "long" : "short";
}

class TradingDataService {
    private subscribers: Map<string, Set<(data: any) => void>> = new Map();
    private intervals: Map<string, NodeJS.Timeout> = new Map();

    // Market data
    private marketData: MarketData = {
        symbol: "BTC-USDT",
        markPrice: 0.078231,
        oraclePrice: 0.0778,
        priceChange24h: 0.00147,
        priceChangePercent24h: 1.92,
        volume24h: 4777133.67,
        openInterest: 5072670.18,
        fundingRate: 0.0013,
        nextFundingTime: Date.now() + 3600000, // 1 hour from now
    };

    // Account data
    private accountBalances: AccountBalance[] = [
        {
            asset: "USDT",
            total: 10000,
            available: 8500,
            locked: 1500,
            usdValue: 10000,
        },
        {
            asset: "BTC",
            total: 50000,
            available: 35000,
            locked: 15000,
            usdValue: 3911.55,
        },
    ];

    private positions: Position[] = [];

    // Order book data
    private orderBook: OrderBookData = {
        bids: [],
        asks: [],
        spread: 0.000085,
        lastUpdateId: 0,
    };

    // Recent trades
    private recentTrades: Trade[] = [];

    constructor() {
        this.initializeOrderBook();
        this.initializeRecentTrades();
        this.startRealTimeUpdates();
    }

    private initializeOrderBook() {
        const basePrice = this.marketData.markPrice;
        const bids: OrderBookLevel[] = [];
        const asks: OrderBookLevel[] = [];

        // Generate initial order book
        for (let i = 0; i < 20; i++) {
            const bidPrice = basePrice - (i + 1) * 0.000001;
            const askPrice = basePrice + (i + 1) * 0.000001;
            const bidSize = Math.floor(Math.random() * 50000) + 5000;
            const askSize = Math.floor(Math.random() * 50000) + 5000;

            bids.push({
                price: bidPrice,
                size: bidSize,
                total: bidSize,
                count: Math.floor(Math.random() * 10) + 1,
            });

            asks.push({
                price: askPrice,
                size: askSize,
                total: askSize,
                count: Math.floor(Math.random() * 10) + 1,
            });
        }

        // Calculate totals
        let runningBidTotal = 0;
        let runningAskTotal = 0;

        bids.forEach((bid) => {
            runningBidTotal += bid.size;
            bid.total = runningBidTotal;
        });

        asks.forEach((ask) => {
            runningAskTotal += ask.size;
            ask.total = runningAskTotal;
        });

        this.orderBook.bids = bids;
        this.orderBook.asks = asks;
    }

    private initializeRecentTrades() {
        const basePrice = this.marketData.markPrice;
        const trades: Trade[] = [];

        for (let i = 0; i < 50; i++) {
            const price = basePrice + (Math.random() - 0.5) * 0.002;
            const size = Math.floor(Math.random() * 100000) + 1000;
            const side = Math.random() > 0.5 ? "buy" : "sell";

            trades.unshift({
                id: `trade_${i}`,
                price,
                size,
                side,
                timestamp: Date.now() - i * 2000, // 2 seconds apart
            });
        }

        this.recentTrades = trades;
    }

    private startRealTimeUpdates() {
        // Update market data every 1 second
        this.intervals.set(
            "marketData",
            setInterval(() => {
                this.updateMarketData();
            }, 1000)
        );

        // Update order book every 200ms
        this.intervals.set(
            "orderBook",
            setInterval(() => {
                this.updateOrderBook();
            }, 200)
        );

        // Add new trades every 2-5 seconds
        this.intervals.set(
            "trades",
            setInterval(() => {
                this.addNewTrade();
            }, Math.random() * 3000 + 2000)
        );

        // Update funding countdown every second
        this.intervals.set(
            "funding",
            setInterval(() => {
                this.updateFundingCountdown();
            }, 1000)
        );
    }

    private updateMarketData() {
        // Small price movements
        const priceChange = (Math.random() - 0.5) * 0.0001;
        this.marketData.markPrice += priceChange;
        this.marketData.oraclePrice += priceChange * 0.98; // Oracle follows with slight lag

        // Update 24h change
        this.marketData.priceChange24h += priceChange;
        this.marketData.priceChangePercent24h =
            (this.marketData.priceChange24h /
                (this.marketData.markPrice - this.marketData.priceChange24h)) *
            100;

        // Update volume (random increase)
        this.marketData.volume24h += Math.random() * 10000;

        // Update price bids/asks based on new markPrice
        const basePrice = this.marketData.markPrice;
        for (let i = 0; i < this.orderBook.bids.length; i++) {
            this.orderBook.bids[i].price = basePrice - (i + 1) * 0.000001;
        }
        for (let i = 0; i < this.orderBook.asks.length; i++) {
            this.orderBook.asks[i].price = basePrice + (i + 1) * 0.000001;
        }

        this.notify("marketData", this.marketData);
    }

    private updateOrderBook() {
        // Update some random levels in the order book
        const updateCount = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < updateCount; i++) {
            // Update bids
            if (this.orderBook.bids.length > 0) {
                const bidIndex = Math.floor(
                    Math.random() * Math.min(10, this.orderBook.bids.length)
                );
                const sizeChange = (Math.random() - 0.5) * 10000;
                this.orderBook.bids[bidIndex].size = Math.max(
                    1000,
                    this.orderBook.bids[bidIndex].size + sizeChange
                );
            }

            // Update asks
            if (this.orderBook.asks.length > 0) {
                const askIndex = Math.floor(
                    Math.random() * Math.min(10, this.orderBook.asks.length)
                );
                const sizeChange = (Math.random() - 0.5) * 10000;
                this.orderBook.asks[askIndex].size = Math.max(
                    1000,
                    this.orderBook.asks[askIndex].size + sizeChange
                );
            }
        }

        // Recalculate totals
        let runningBidTotal = 0;
        let runningAskTotal = 0;

        this.orderBook.bids.forEach((bid) => {
            runningBidTotal += bid.size;
            bid.total = runningBidTotal;
        });

        this.orderBook.asks.forEach((ask) => {
            runningAskTotal += ask.size;
            ask.total = runningAskTotal;
        });

        this.orderBook.lastUpdateId++;
        this.notify("orderBook", this.orderBook);
    }

    private addNewTrade() {
        const basePrice = this.marketData.markPrice;
        const price = basePrice + (Math.random() - 0.5) * 0.001;
        const size = Math.floor(Math.random() * 50000) + 1000;
        const side = Math.random() > 0.5 ? "buy" : "sell";

        const newTrade: Trade = {
            id: `trade_${Date.now()}`,
            price,
            size,
            side,
            timestamp: Date.now(),
        };

        this.recentTrades.unshift(newTrade);

        // Keep only last 100 trades
        if (this.recentTrades.length > 100) {
            this.recentTrades = this.recentTrades.slice(0, 100);
        }

        this.notify("trades", this.recentTrades);
    }

    private updateFundingCountdown() {
        this.marketData.nextFundingTime = Math.max(
            0,
            this.marketData.nextFundingTime - 1000
        );

        if (this.marketData.nextFundingTime <= 0) {
            // Reset funding time to next hour
            this.marketData.nextFundingTime = 3600000;
            // Update funding rate
            this.marketData.fundingRate = (Math.random() - 0.5) * 0.002;
        }

        this.notify("fundingCountdown", {
            nextFundingTime: this.marketData.nextFundingTime,
            fundingRate: this.marketData.fundingRate,
        });
    }

    // Public methods
    subscribe(event: string, callback: (data: any) => void) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }
        this.subscribers.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.get(event)?.delete(callback);
        };
    }

    private notify(event: string, data: any) {
        this.subscribers.get(event)?.forEach((callback) => callback(data));
        this.subscribers
            .get("*")
            ?.forEach((callback) => callback({ event, data }));
    }

    // Get current data
    getMarketData(): MarketData {
        return { ...this.marketData };
    }

    getOrderBook(): OrderBookData {
        return {
            ...this.orderBook,
            bids: [...this.orderBook.bids],
            asks: [...this.orderBook.asks],
        };
    }

    getRecentTrades(): Trade[] {
        return [...this.recentTrades];
    }

    getAccountBalances(): AccountBalance[] {
        return [...this.accountBalances];
    }

    getPositions(): Position[] {
        return [...this.positions];
    }

    // Trading methods
    async placeOrder(order: {
        symbol: string;
        side: "buy" | "sell";
        type: "market" | "limit";
        size: number;
        price?: number;
        reduceOnly?: boolean;
    }): Promise<{ success: boolean; orderId?: string; error?: string }> {
        // Simulate order validation
        const balance = this.accountBalances.find((b) => b.asset === "USDC");
        if (!balance || balance.available < 100) {
            return { success: false, error: "Insufficient balance" };
        }

        // Simulate order execution
        const executionPrice =
            order.type === "market"
                ? this.marketData.markPrice
                : order.price || this.marketData.markPrice;

        const orderValue = order.size * executionPrice;

        // Update balances
        if (order.side === "buy") {
            const usdcBalance = this.accountBalances.find(
                (b) => b.asset === "USDT"
            )!;
            const btcBalance = this.accountBalances.find(
                (b) => b.asset === "BTC"
            )!;

            usdcBalance.available -= orderValue;
            usdcBalance.total -= orderValue;
            btcBalance.available += order.size;
            btcBalance.total += order.size;
        } else {
            const usdcBalance = this.accountBalances.find(
                (b) => b.asset === "USDT"
            )!;
            const btcBalance = this.accountBalances.find(
                (b) => b.asset === "BTC"
            )!;

            btcBalance.available -= order.size;
            btcBalance.total -= order.size;
            usdcBalance.available += orderValue;
            usdcBalance.total += orderValue;
        }

        // Update or create position
        const existingPosition = this.positions.find(
            (p) => p.symbol === order.symbol
        );
        if (existingPosition) {
            if (existingPosition.side === orderSideToPositionSide(order.side)) {
                // Increase position
                const totalSize = existingPosition.size + order.size;
                const totalValue =
                    existingPosition.size * existingPosition.entryPrice +
                    orderValue;
                existingPosition.entryPrice = totalValue / totalSize;
                existingPosition.size = totalSize;
            } else {
                // Reduce or reverse position
                if (existingPosition.size > order.size) {
                    existingPosition.size -= order.size;
                } else if (existingPosition.size < order.size) {
                    existingPosition.side = orderSideToPositionSide(order.side);
                    existingPosition.size = order.size - existingPosition.size;
                    existingPosition.entryPrice = executionPrice;
                } else {
                    // Close position
                    this.positions = this.positions.filter(
                        (p) => p.symbol !== order.symbol
                    );
                }
            }
        } else {
            // Create new position
            this.positions.push({
                symbol: order.symbol,
                side: orderSideToPositionSide(order.side),
                size: order.size,
                entryPrice: executionPrice,
                markPrice: this.marketData.markPrice,
                pnl: 0,
                pnlPercent: 0,
                liquidationPrice: this.calculateLiquidationPrice(
                    executionPrice,
                    orderSideToPositionSide(order.side),
                    1
                ),
                margin: orderValue,
                leverage: 1,
            });
        }

        // Update position PnL
        this.updatePositionsPnL();

        // Notify subscribers
        this.notify("balances", this.accountBalances);
        this.notify("positions", this.positions);

        // Add to recent trades
        const trade: Trade = {
            id: `order_${Date.now()}`,
            price: executionPrice,
            size: order.size,
            side: order.side,
            timestamp: Date.now(),
        };

        this.recentTrades.unshift(trade);
        this.notify("trades", this.recentTrades);

        return { success: true, orderId: `order_${Date.now()}` };
    }

    private updatePositionsPnL() {
        this.positions.forEach((position) => {
            const priceDiff =
                position.side === "long"
                    ? this.marketData.markPrice - position.entryPrice
                    : position.entryPrice - this.marketData.markPrice;

            position.markPrice = this.marketData.markPrice;
            position.pnl = priceDiff * position.size;
            position.pnlPercent = (priceDiff / position.entryPrice) * 100;
        });
    }

    private calculateLiquidationPrice(
        entryPrice: number,
        side: "long" | "short",
        leverage: number
    ): number {
        const maintenanceMargin = 0.005; // 0.5%

        if (side === "long") {
            return entryPrice * (1 - 1 / leverage + maintenanceMargin);
        } else {
            return entryPrice * (1 + 1 / leverage - maintenanceMargin);
        }
    }

    // Cleanup
    destroy() {
        this.intervals.forEach((interval) => clearInterval(interval));
        this.intervals.clear();
        this.subscribers.clear();
    }
}

// Singleton instance
export const tradingDataService = new TradingDataService();

// React hook for using the trading data service
import { useEffect, useState, useCallback } from "react";

export function useTradingData() {
    const [marketData, setMarketData] = useState(
        tradingDataService.getMarketData()
    );
    const [orderBook, setOrderBook] = useState(
        tradingDataService.getOrderBook()
    );
    const [recentTrades, setRecentTrades] = useState(
        tradingDataService.getRecentTrades()
    );
    const [balances, setBalances] = useState(
        tradingDataService.getAccountBalances()
    );
    const [positions, setPositions] = useState(
        tradingDataService.getPositions()
    );
    const [fundingCountdown, setFundingCountdown] = useState({
        nextFundingTime: marketData.nextFundingTime,
        fundingRate: marketData.fundingRate,
    });

    useEffect(() => {
        const unsubscribers = [
            tradingDataService.subscribe("marketData", setMarketData),
            tradingDataService.subscribe("orderBook", setOrderBook),
            tradingDataService.subscribe("trades", setRecentTrades),
            tradingDataService.subscribe("balances", setBalances),
            tradingDataService.subscribe("positions", setPositions),
            tradingDataService.subscribe(
                "fundingCountdown",
                setFundingCountdown
            ),
        ];

        return () => {
            unsubscribers.forEach((unsub) => unsub());
        };
    }, []);

    const placeOrder = useCallback(
        async (orderData: {
            symbol: string;
            side: "buy" | "sell";
            type: "market" | "limit";
            size: number;
            price?: number;
            reduceOnly?: boolean;
        }) => {
            return await tradingDataService.placeOrder(orderData);
        },
        []
    );

    return {
        marketData,
        orderBook,
        recentTrades,
        balances,
        positions,
        fundingCountdown,
        placeOrder,
    };
}

// Utility functions
export function formatPrice(price: number, decimals: number = 6): string {
    return price.toFixed(decimals);
}

export function formatSize(size: number): string {
    if (size >= 1000000) {
        return `${(size / 1000000).toFixed(2)}M`;
    } else if (size >= 1000) {
        return `${(size / 1000).toFixed(2)}K`;
    }
    return size.toLocaleString();
}

export function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function formatCountdown(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function getPriceColor(side: "buy" | "sell"): string {
    return side === "buy" ? "text-green-400" : "text-red-400";
}

export function getPriceChangeColor(change: number): string {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
}
