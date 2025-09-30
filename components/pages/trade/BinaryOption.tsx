import { TrendingDown, TrendingUp } from "lucide-react";
import {
    TradingState,
    PositionType,
    OrderOption,
    TradingModalState,
} from "@/types/TradingInterface";
import { COMMON_CLASSES } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const entries = ["0.01", "0.05", "0.1", "0.2", "0.5", "1.0"];

interface BinaryOptionPanelProps {
    tradingState: TradingState;
    onStateChange: (updates: Partial<TradingState>) => void;
    onOptionChange: (option: OrderOption) => void;
    onModalStateChange: (updates: Partial<TradingModalState>) => void;
}

export function BinaryOptionPanel({
    tradingState,
    onStateChange,
    onOptionChange,
    onModalStateChange,
}: BinaryOptionPanelProps) {
    const [entry, setEntry] = useState("0.01");

    return (
        <div
            className={cn(
                COMMON_CLASSES.gradientBg,
                "text-center",
                COMMON_CLASSES.roundedMd,
                "max-h-[670px] w-full"
            )}
        >
            <div className="h-full flex flex-col items-center">
                <div className="p-4 w-full flex flex-col items-center">
                    <span className="text-sm font-semibold self-start">
                        In Next 5 mins, Price Will Be...
                    </span>
                    <PositionSelector
                        selectedPosition={tradingState.selectedPosition}
                        onPositionChange={(position) =>
                            onStateChange({ selectedPosition: position })
                        }
                    />
                </div>

                <div className="p-4 w-full flex flex-col items-center">
                    <span className="text-sm font-semibold self-start">
                        Your Entry
                    </span>
                    <div className="w-full my-2 p-0.5 gap-2 flex items-center flex-wrap">
                        {entries.map((value: string, index: number) => (
                            <Button
                                key={index}
                                className={`px-5 py-3 w-16 h-fit hover:bg-gray-500 transition-colors ${
                                    entry === value
                                        ? "bg-gradient text-gray-800"
                                        : "bg-gray-600 text-gray-50"
                                }`}
                                onClick={() => setEntry(value)}
                            >
                                {value}
                            </Button>
                        ))}

                        <EntryInput entry={entry} setEntry={setEntry} />

                        <div className="text-center text-sm text-gray-500">
                            Potential payout:{" "}
                            {(parseFloat(entry) * 1.9).toFixed(3)} SUI
                        </div>
                    </div>
                </div>

                <div className="p-4 w-full flex flex-col items-center">
                    <Button className="w-full h-12 bg-gradient text-gray-800 font-medium text-md">
                        Add Funds
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PositionSelector({
    selectedPosition,
    onPositionChange,
}: {
    selectedPosition: PositionType;
    onPositionChange: (position: PositionType) => void;
}) {
    return (
        <div className="w-full my-2 p-0.5 grid grid-cols-2 items-center bg-gray-600 rounded-md">
            <span
                className={`flex items-center justify-center gap-1 py-1.5 text-xl/10 font-semibold border-none rounded-md cursor-pointer ${
                    selectedPosition === "long"
                        ? "bg-green-600 text-gray-50"
                        : "bg-transparent text-gray-50"
                }`}
                onClick={() => onPositionChange("long")}
            >
                UP <TrendingUp />
            </span>
            <span
                className={`flex items-center justify-center gap-1 py-1.5 text-xl/10 font-semibold border-none rounded-md cursor-pointer ${
                    selectedPosition === "short"
                        ? "bg-red-600 text-gray-50"
                        : "bg-transparent text-gray-50"
                }`}
                onClick={() => onPositionChange("short")}
            >
                DOWN <TrendingDown />
            </span>
        </div>
    );
}

function EntryInput({
    entry,
    setEntry,
}: {
    entry: string;
    setEntry: (entry: string) => void;
}) {
    return (
        <div className="w-full px-4 py-1 flex items-center gap-1.5 border rounded-md text-nowrap">
            <Input
                type="text"
                inputMode="decimal"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="pl-0 py-2 h-fit text-left border-none hide-number-stepper !text-lg"
            />
            <div className="flex items-center gap-3 text-md cursor-pointer text-gray-400">
                SUI
            </div>
        </div>
    );
}
