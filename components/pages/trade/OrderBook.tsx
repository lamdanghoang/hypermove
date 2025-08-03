"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomSelect from "@/components/ui/custom-select";
import {
    useTradingData,
    formatPrice,
    formatSize,
    formatTime,
    getPriceColor,
    OrderBookLevel,
} from "@/services/TradingDataService";
import {
    Order,
    Trade,
    useOrderBook,
    useTradeStream,
} from "@/services/BinanceWebSocketService";
import { useEffect, useMemo } from "react";

const priceStepOptions = [
    { label: "0.000001", value: "0.000001" },
    { label: "0.000002", value: "0.000002" },
    { label: "0.000005", value: "0.000005" },
    { label: "0.00001", value: "0.00001" },
    { label: "0.0001", value: "0.0001" },
    { label: "0.001", value: "0.001" },
    { label: "0.01", value: "0.01" },
];

const pairOptions = [
    { label: "BTC", value: "BTC" },
    { label: "USDT", value: "USDT" },
];

interface OrderBookProps {
    selectedPriceStepOption: string;
}

export function OrderBook({ selectedPriceStepOption }: OrderBookProps) {
    const { bids, asks, spread, percentSpread } = useOrderBook("btcusdt", 10);
    const trades = useTradeStream("btcusdt");

    return (
        <div className="bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[670px]">
            <Tabs defaultValue="orderbook" className="w-full gap-0">
                <TabsList
                    variant="custom"
                    className="px-3 w-full h-full text-nowrap overflow-x-auto flex-nowrap hide-scrollbar"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    <TabsTrigger
                        variant="custom"
                        value="orderbook"
                        className="px-2 py-2.5 text-xs"
                    >
                        Order Book
                    </TabsTrigger>
                    <TabsTrigger
                        variant="custom"
                        value="trades"
                        className="px-2 py-2.5 text-xs"
                    >
                        Trades
                    </TabsTrigger>
                </TabsList>

                <TabsContent className="text-white" value="orderbook">
                    <OrderBookContent
                        selectedPriceStepOption={selectedPriceStepOption}
                        bids={bids}
                        asks={asks}
                        spread={spread}
                        percentSpread={percentSpread}
                    />
                </TabsContent>

                <TabsContent
                    className="text-white h-[calc(100%-49px)]"
                    value="trades"
                >
                    <TradesContent trades={trades} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function OrderBookContent({
    selectedPriceStepOption,
    bids,
    asks,
    spread,
    percentSpread,
}: {
    selectedPriceStepOption: string;
    bids: Order[];
    asks: Order[];
    spread: number | null;
    percentSpread: number | null;
}) {
    return (
        <>
            <div className="px-2.5 py-2 flex items-center justify-between">
                <CustomSelect
                    options={priceStepOptions}
                    defaultValue={selectedPriceStepOption}
                    className="min-w-20"
                />
                <CustomSelect
                    options={pairOptions}
                    defaultValue="BTC"
                    className="min-w-21"
                    left={false}
                />
            </div>

            <OrderBookHeader />

            <div className="min-h-0">
                <div className="h-full grid grid-rows-[1fr_26px_1fr]">
                    <OrderBookSide type="sell" levels={asks} />
                    <SpreadIndicator
                        spread={spread}
                        percentSpread={percentSpread}
                    />
                    <OrderBookSide type="buy" levels={bids} />
                </div>
            </div>
        </>
    );
}

function OrderBookHeader() {
    return (
        <div className="px-2.5 mb-2">
            <div className="grid grid-cols-[20%_40%_40%]">
                <span className="text-xs text-slate-400 text-left">Price</span>
                <span className="text-xs text-slate-400 text-right">
                    Size (BTC)
                </span>
                <span className="text-xs text-slate-400 text-right">
                    Total (BTC)
                </span>
            </div>
        </div>
    );
}

function OrderBookSide({
    type,
    levels,
}: {
    type: "buy" | "sell";
    levels: Order[];
}) {
    const isAsk = type === "sell";

    const parsedLevels = useMemo(() => {
        const sorted = [...levels].sort((a, b) =>
            isAsk ? parseFloat(b[0]) - parseFloat(a[0]) : 0
        );

        const levelsForTotal = isAsk ? [...sorted].reverse() : sorted;

        let tempTotal = 0;
        const totals = levelsForTotal.map(([, size]) => {
            tempTotal += parseFloat(size);
            return tempTotal;
        });

        if (isAsk) totals.reverse();

        return sorted.map(([p, s], i) => ({
            price: parseFloat(p),
            size: parseFloat(s),
            total: totals[i],
        }));
    }, [levels]);

    const maxTotal = useMemo(() => {
        return parsedLevels.length > 0
            ? Math.max(...parsedLevels.map((l) => l.total))
            : 1;
    }, [parsedLevels]);

    const colorClass = isAsk ? "text-red-400" : "text-green-400";

    return (
        <div className="flex flex-col justify-around gap-1">
            {parsedLevels.map(({ price, size, total }, i) => {
                const percent = (total / maxTotal) * 100;

                return (
                    <div
                        key={i}
                        className="py-0.5 h-5.5 relative cursor-pointer"
                    >
                        <div
                            className={`absolute inset-y-0 left-0 ${
                                isAsk ? "bg-red-400/10" : "bg-green-400/10"
                            }`}
                            style={{ width: `${percent}%` }}
                        />

                        <div className="relative grid grid-cols-[20%_40%_40%] h-full items-center z-10">
                            <span className={`pl-2.5 text-xs ${colorClass}`}>
                                {price.toFixed(2)}
                            </span>
                            <span className="text-xs text-right pr-1">
                                {size.toFixed(4)}
                            </span>
                            <span className="pr-2.5 text-xs text-right">
                                {total.toFixed(4)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SpreadIndicator({
    spread,
    percentSpread,
}: {
    spread: number | null;
    percentSpread: number | null;
}) {
    return (
        <div className="my-1 flex gap-8 justify-center items-center text-xs bg-gray-700">
            <span>Spread</span>
            <span>{formatPrice(spread || 0, 2)}</span>
            <span>{formatPrice(percentSpread || 0, 5)}%</span>
        </div>
    );
}

function TradesContent({ trades }: { trades: Trade[] }) {
    return (
        <div className="h-full overflow-auto grid grid-rows-[auto_1fr]">
            <div className="px-2.5 my-2">
                <div className="grid grid-cols-[20%_40%_40%]">
                    <span className="text-xs text-slate-400 text-left">
                        Price
                    </span>
                    <span className="text-xs text-slate-400 text-right">
                        Size (BTC)
                    </span>
                    <span className="text-xs text-slate-400 text-right">
                        Time
                    </span>
                </div>
            </div>

            <div className="min-h-0 h-[calc(670px-65px)]">
                <div className="flex flex-col justify-start gap-1 h-[calc(100%-16px)] w-full overflow-auto hide-scrollbar -mt-1">
                    {trades.map((trade, i) => (
                        <div
                            key={i}
                            className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                        >
                            <span
                                className={`pl-2.5 text-xs ${getPriceColor(
                                    trade.isBuyerMaker ? "sell" : "buy"
                                )}`}
                            >
                                {formatPrice(trade.price, 2)}
                            </span>
                            <span className="text-xs text-right pr-1">
                                {trade.quantity.toFixed(4)}
                            </span>
                            <span className="flex items-center justify-end gap-1 pr-2.5 text-xs">
                                <span>{formatTime(trade.timestamp)}</span>
                                <Link href="#">
                                    <SquareArrowOutUpRight className="w-3 h-3" />
                                </Link>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
