import { ChevronDown } from "lucide-react";

const marketData = [
    { label: "Mark", value: "0.078231" },
    { label: "Oracle", value: "0.077800" },
    { label: "24h Change", value: "+0.001470 / +1.92%" },
    { label: "24h Volume", value: "$4,777,133.67" },
    { label: "Open Interest", value: "$5,072,670.18" },
    { label: "Funding / Countdown", value: "0.0013% 00:59:53" },
];

export function MarketInfo() {
    return (
        <div className="px-3 py-2 w-full grid grid-cols-[repeat(2,auto)] gap-8 items-center bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md">
            <TokenPair />
            <MarketDataGrid />
        </div>
    );
}

function TokenPair() {
    return (
        <div className="flex items-center py-2 gap-3">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-400"></div>
                <span className="text-xl text-nowrap">CHILLGUY-USD</span>
            </div>
            <ChevronDown className="w-5 h-5" />
        </div>
    );
}

function MarketDataGrid() {
    return (
        <div className="overflow-x-auto hide-scrollbar">
            <div className="overflow-x-auto hide-scrollbar grid grid-cols-[repeat(6,auto)] gap-8 items-center text-nowrap">
                {marketData.map((item, index) => (
                    <MarketDataItem
                        key={index}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>
        </div>
    );
}

interface MarketDataItemProps {
    label: string;
    value: string;
}

function MarketDataItem({ label, value }: MarketDataItemProps) {
    return (
        <div className="grid grid-rows-2 gap-1">
            <span className="text-slate-400 text-xs">{label}</span>
            <span className="text-xs">
                {label === "Funding / Countdown" ? (
                    <>
                        <span>0.0013%</span>&nbsp; 00:59:53
                    </>
                ) : (
                    value
                )}
            </span>
        </div>
    );
}
