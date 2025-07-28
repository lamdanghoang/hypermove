import { DollarSign, Percent } from "lucide-react";
import StarIcon from "@/components/icons/StarIcon";
import { FavoriteType } from "@/types/TradingInterface";

interface TradingHeaderProps {
    selectedFavorite: FavoriteType;
    onFavoriteChange: (favorite: FavoriteType) => void;
}

const mockTickers = [
    { symbol: "AAVE-USD", change: "+0.19%" },
    { symbol: "ACE-USD", change: "+4.28%" },
    { symbol: "ADA-USD", change: "-0.28%" },
    { symbol: "ALGO-USD", change: "-1.23%" },
];

export function TradingHeader({
    selectedFavorite,
    onFavoriteChange,
}: TradingHeaderProps) {
    return (
        <div className="px-3 py-1 w-full grid grid-cols-[auto_auto_1fr] items-center gap-2 overflow-hidden bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md">
            <StarIcon className="w-3 h-3 text-yellow-500" />

            <div className="p-0.5 flex items-center bg-gray-600 rounded-md">
                <ToggleButton
                    active={selectedFavorite === "dollar"}
                    onClick={() => onFavoriteChange("dollar")}
                    icon={<DollarSign className="w-3 h-3" />}
                />
                <ToggleButton
                    active={selectedFavorite === "percent"}
                    onClick={() => onFavoriteChange("percent")}
                    icon={<Percent className="w-3 h-3" />}
                />
            </div>

            <div className="w-full flex items-center overflow-x-auto hide-scrollbar text-nowrap">
                {[...mockTickers, ...mockTickers].map((ticker, index) => (
                    <TickerItem
                        key={index}
                        symbol={ticker.symbol}
                        change={ticker.change}
                    />
                ))}
            </div>
        </div>
    );
}

interface ToggleButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
}

function ToggleButton({ active, onClick, icon }: ToggleButtonProps) {
    return (
        <span
            className={`p-1.5 border rounded-md cursor-pointer border-none ${
                active
                    ? "bg-gradient text-gray-800"
                    : "bg-transparent text-gray-50"
            }`}
            onClick={onClick}
        >
            {icon}
        </span>
    );
}

interface TickerItemProps {
    symbol: string;
    change: string;
}

function TickerItem({ symbol, change }: TickerItemProps) {
    return (
        <div className="flex items-center p-2 gap-1 text-xs">
            <span>{symbol}</span>
            <span>{change}</span>
        </div>
    );
}
