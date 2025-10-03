import { ChevronDown } from "lucide-react";
import {
    useTradingData,
    formatPrice,
    getPriceChangeColor,
} from "@/services/TradingDataService";
import { useMarketStats } from "@/services/BinanceWebSocketService";
import { formatCountdown } from "@/lib/tradingUtils";

export function MarketInfo() {
    const marketData = useMarketStats("btcusdt");

    if (!marketData) return null;

    const marketDataItems = [
        {
            label: "Mark",
            value: marketData.markPrice.toLocaleString(undefined, {
                maximumFractionDigits: 2,
            }),
        },
        {
            label: "24h Change",
            value: `${
                marketData.priceChangePercent >= 0 ? "+" : "-"
            }${formatPrice(
                marketData.markPrice * (marketData.priceChangePercent / 100),
                2
            )} / ${
                marketData.priceChangePercent >= 0 ? "+" : ""
            }${marketData.priceChangePercent.toFixed(2)}%`,
            colorClass: getPriceChangeColor(marketData.priceChangePercent),
        },
        {
            label: "24h Volume",
            value: `$${marketData.volume.toLocaleString(undefined, {
                maximumFractionDigits: 2,
            })}`,
        },
        {
            label: "Open Interest",
            value: `$${marketData.openInterest.toLocaleString(undefined, {
                maximumFractionDigits: 2,
            })}`,
        },
        {
            label: "Funding / Countdown",
            value: `${(marketData.fundingRate * 100).toFixed(
                4
            )}% ${formatCountdown(marketData.nextFundingTime)}`,
            colorClass: getPriceChangeColor(marketData.fundingRate),
        },
    ];

    return (
        <div className="px-3 py-2 w-full grid grid-cols-[repeat(2,auto)] gap-8 items-center bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md">
            <TokenPair />
            <MarketDataGrid marketDataItems={marketDataItems} />
        </div>
    );
}

function TokenPair() {
    return (
        <div className="flex items-center py-2 gap-3">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-400"></div>
                <span className="text-xl text-nowrap">BTC-USDT</span>
            </div>
            <ChevronDown className="w-5 h-5" />
        </div>
    );
}

interface MarketDataItemProps {
    label: string;
    value: string;
    colorClass?: string;
}

function MarketDataGrid({ marketDataItems }: { marketDataItems: MarketDataItemProps[] }) {
    return (
        <div className="overflow-x-auto hide-scrollbar">
            <div className="overflow-x-auto hide-scrollbar grid grid-cols-[repeat(6,auto)] gap-8 items-center text-nowrap">
                {marketDataItems.map((item, index) => (
                    <MarketDataItem
                        key={index}
                        label={item.label}
                        value={item.value}
                        colorClass={item.colorClass}
                    />
                ))}
            </div>
        </div>
    );
}

function MarketDataItem({ label, value, colorClass }: MarketDataItemProps) {
    return (
        <div className="grid grid-rows-2 gap-1">
            <span className="text-slate-400 text-xs">{label}</span>
            <span className={`text-xs ${colorClass || ""}`}>{value}</span>
        </div>
    );
}
