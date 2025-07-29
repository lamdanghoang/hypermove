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

const priceStepOptions = [
    { label: "0.000001", value: "0.000001" },
    { label: "0.000002", value: "0.000002" },
    { label: "0.000005", value: "0.000005" },
    { label: "0.00001", value: "0.00001" },
    { label: "0.0001", value: "0.0001" },
    { label: "0.001", value: "0.001" },
];

const pairOptions = [
    { label: "CHILLGUY", value: "CHILLGUY" },
    { label: "USD", value: "USD" },
];

interface OrderBookProps {
    selectedPriceStepOption: string;
}

export function OrderBook({ selectedPriceStepOption }: OrderBookProps) {
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
                    />
                </TabsContent>

                <TabsContent
                    className="text-white h-[calc(100%-49px)]"
                    value="trades"
                >
                    <TradesContent />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function OrderBookContent({
    selectedPriceStepOption,
}: {
    selectedPriceStepOption: string;
}) {
    const { orderBook } = useTradingData();

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
                    defaultValue="CHILLGUY"
                    className="min-w-21"
                    left={false}
                />
            </div>

            <OrderBookHeader />

            <div className="min-h-0">
                <div className="h-full grid grid-rows-[1fr_26px_1fr]">
                    <OrderBookSide
                        type="sell"
                        levels={orderBook.asks.slice(0, 11).reverse()}
                    />
                    <SpreadIndicator spread={orderBook.spread} />
                    <OrderBookSide
                        type="buy"
                        levels={orderBook.bids.slice(0, 11)}
                    />
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
                    Size (CHILLGUY)
                </span>
                <span className="text-xs text-slate-400 text-right">
                    Total (CHILLGUY)
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
    levels: OrderBookLevel[];
}) {
    const colorClass = type === "sell" ? "text-red-400" : "text-green-400";

    return (
        <div className="flex flex-col justify-around gap-1">
            {levels.map((level, i) => (
                <div
                    key={i}
                    className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                >
                    <span className={`pl-2.5 text-xs ${colorClass}`}>
                        {formatPrice(level.price)}
                    </span>
                    <span className="text-xs text-right pr-1">
                        {formatSize(level.size)}
                    </span>
                    <span className="pr-2.5 text-xs text-right">
                        {formatSize(level.total)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function SpreadIndicator({ spread }: { spread: number }) {
    const spreadPercent = ((spread / 0.078) * 100).toFixed(3);

    return (
        <div className="my-1 flex gap-8 justify-center items-center text-xs bg-gray-700">
            <span>Spread</span>
            <span>{formatPrice(spread)}</span>
            <span>{spreadPercent}%</span>
        </div>
    );
}

function TradesContent() {
    const { recentTrades } = useTradingData();

    return (
        <div className="h-full overflow-auto grid grid-rows-[auto_1fr]">
            <div className="px-2.5 my-2">
                <div className="grid grid-cols-[20%_40%_40%]">
                    <span className="text-xs text-slate-400 text-left">
                        Price
                    </span>
                    <span className="text-xs text-slate-400 text-right">
                        Size (CHILLGUY)
                    </span>
                    <span className="text-xs text-slate-400 text-right">
                        Time
                    </span>
                </div>
            </div>

            <div className="min-h-0 h-[calc(670px-65px)]">
                <div className="flex flex-col justify-start gap-1 h-[calc(100%-16px)] w-full overflow-auto hide-scrollbar -mt-1">
                    {recentTrades.map((trade, i) => (
                        <div
                            key={trade.id}
                            className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                        >
                            <span
                                className={`pl-2.5 text-xs ${getPriceColor(
                                    trade.side
                                )}`}
                            >
                                {formatPrice(trade.price)}
                            </span>
                            <span className="text-xs text-right pr-1">
                                {formatSize(trade.size)}
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
