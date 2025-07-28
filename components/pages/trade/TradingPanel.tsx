import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CustomSelect from "@/components/ui/custom-select";
import {
    TradingState,
    PositionType,
    OrderOption,
    TradingModalState,
} from "@/types/TradingInterface";
import { PAIR_OPTIONS, COMMON_CLASSES } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TradingPanelProps {
    tradingState: TradingState;
    onStateChange: (updates: Partial<TradingState>) => void;
    onOptionChange: (option: OrderOption) => void;
    onModalStateChange: (updates: Partial<TradingModalState>) => void;
}

export function TradingPanel({
    tradingState,
    onStateChange,
    onOptionChange,
    onModalStateChange,
}: TradingPanelProps) {
    return (
        <div
            className={cn(
                COMMON_CLASSES.gradientBg,
                "text-center",
                COMMON_CLASSES.roundedMd,
                "h-[670px]"
            )}
        >
            <div className="h-full flex flex-col items-center">
                <TradingModeButtons
                    modalState={tradingState.modalState}
                    onModalStateChange={onModalStateChange}
                />

                <Tabs defaultValue="market" className="w-full gap-0 flex-1">
                    <TabsList
                        variant="custom"
                        className={cn(
                            "px-3 w-full h-fit",
                            COMMON_CLASSES.textNowrap,
                            "flex-nowrap",
                            COMMON_CLASSES.hideScrollbar
                        )}
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        <TabsTrigger
                            variant="custom"
                            value="market"
                            className="px-0 py-2.5 text-xs"
                        >
                            Market
                        </TabsTrigger>
                        <TabsTrigger
                            variant="custom"
                            value="limit"
                            className="px-0 py-2.5 text-xs"
                        >
                            Limit
                        </TabsTrigger>
                        <TabsTrigger
                            variant="custom"
                            value="pro"
                            disabled
                            className="px-0 py-2.5 text-xs flex items-center justify-center gap-2"
                        >
                            Pro
                            <ChevronDown className="w-3.5 h-3.5" />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        className="text-white h-[calc(100%-49px)]"
                        value="market"
                    >
                        <MarketOrderForm
                            tradingState={tradingState}
                            onStateChange={onStateChange}
                            onOptionChange={onOptionChange}
                        />
                    </TabsContent>

                    <TabsContent
                        className="text-white h-[calc(100%-49px)]"
                        value="limit"
                    >
                        <LimitOrderForm
                            tradingState={tradingState}
                            onStateChange={onStateChange}
                            onOptionChange={onOptionChange}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

interface TradingModeButtonsProps {
    modalState: TradingModalState;
    onModalStateChange: (updates: Partial<TradingModalState>) => void;
}

export function TradingModeButtons({
    modalState,
    onModalStateChange,
}: TradingModeButtonsProps) {
    return (
        <>
            <div className="pt-3 grid grid-cols-3 gap-3 items-center">
                <Button
                    className={cn(
                        "py-2 w-18 h-fit text-xs",
                        COMMON_CLASSES.gradientButton
                    )}
                    onClick={() =>
                        onModalStateChange({ showMarginModal: true })
                    }
                >
                    {modalState.marginMode === "cross" ? "Cross" : "Isolated"}
                </Button>
                <Button
                    className={cn(
                        "py-2 w-18 h-fit text-xs",
                        COMMON_CLASSES.gradientButton
                    )}
                    onClick={() =>
                        onModalStateChange({ showLeverageModal: true })
                    }
                >
                    {modalState.leverage}x
                </Button>
                <Button
                    className={cn(
                        "py-2 w-18 h-fit text-xs",
                        COMMON_CLASSES.gradientButton
                    )}
                    onClick={() => onModalStateChange({ showInfoModal: true })}
                >
                    One-Way
                </Button>
            </div>

            <MarginModeModal
                isOpen={modalState.showMarginModal}
                onClose={() => onModalStateChange({ showMarginModal: false })}
                selectedMode={modalState.marginMode}
                onModeChange={(mode) =>
                    onModalStateChange({ marginMode: mode })
                }
            />

            <LeverageModal
                isOpen={modalState.showLeverageModal}
                onClose={() => onModalStateChange({ showLeverageModal: false })}
                leverage={modalState.leverage}
                onLeverageChange={(leverage) =>
                    onModalStateChange({ leverage })
                }
            />

            <PositionInfoModal
                isOpen={modalState.showInfoModal}
                onClose={() => onModalStateChange({ showInfoModal: false })}
            />
        </>
    );
}

function MarginModeModal({
    isOpen,
    onClose,
    selectedMode,
    onModeChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    selectedMode: "cross" | "isolated";
    onModeChange: (mode: "cross" | "isolated") => void;
}) {
    const [tempMode, setTempMode] = useState<"cross" | "isolated">(
        selectedMode
    );

    // Reset temp mode when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempMode(selectedMode);
        }
    }, [isOpen, selectedMode]);

    const handleEstablishConnection = () => {
        onModeChange(tempMode);
        onClose();
    };

    const handleCancel = () => {
        setTempMode(selectedMode); // Reset to original value
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-medium">
                        Margin Mode
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="cross"
                                checked={tempMode === "cross"}
                                onCheckedChange={() => setTempMode("cross")}
                                className="mt-1 border-slate-600 data-[state=checked]:bg-gray-200 data-[state=checked]:border-gray-200"
                            />
                            <div className="space-y-2">
                                <Label
                                    htmlFor="cross"
                                    className="text-white font-medium cursor-pointer"
                                >
                                    Cross
                                </Label>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    All cross positions share the same cross
                                    margin as collateral. In the event of
                                    liquidation, your cross margin balance and
                                    any remaining open positions under assets in
                                    this mode may be forfeited.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="isolated"
                                checked={tempMode === "isolated"}
                                onCheckedChange={() => setTempMode("isolated")}
                                className="mt-1 border-slate-600 data-[state=checked]:bg-gray-200 data-[state=checked]:border-gray-200"
                            />
                            <div className="space-y-2">
                                <Label
                                    htmlFor="isolated"
                                    className="text-white font-medium cursor-pointer"
                                >
                                    Isolated
                                </Label>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Manage your risk on individual positions by
                                    restricting the amount of margin allocated
                                    to each. If the margin ratio of an isolated
                                    position reaches 100%, the position will be
                                    liquidated. Margin can be added or removed
                                    to individual positions in this mode.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-gradient text-gray-800 font-medium"
                        onClick={handleEstablishConnection}
                    >
                        Establish Connection
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function LeverageModal({
    isOpen,
    onClose,
    leverage,
    onLeverageChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    leverage: number;
    onLeverageChange: (leverage: number) => void;
}) {
    const [tempLeverage, setTempLeverage] = useState<number>(leverage);

    // Reset temp leverage when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempLeverage(leverage);
        }
    }, [isOpen, leverage]);

    const handleEstablishConnection = () => {
        onLeverageChange(tempLeverage);
        onClose();
    };

    const handleCancel = () => {
        setTempLeverage(leverage); // Reset to original value
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-medium">
                        Adjust Leverage
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <p className="text-sm text-gray-400">
                        Control the leverage used for CHILLGUY positions. The
                        maximum leverage is 3x.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Slider
                                value={[tempLeverage]}
                                onValueChange={(value) =>
                                    setTempLeverage(value[0])
                                }
                                max={3}
                                min={1}
                                step={0.1}
                                className="flex-1"
                            />
                            <div className="flex items-center space-x-1 text-white font-medium">
                                <span>{tempLeverage}</span>
                                <span className="text-sm">x</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-gradient text-gray-800 font-medium"
                        onClick={handleEstablishConnection}
                    >
                        Establish Connection
                    </Button>

                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-400">
                            Note that setting a higher leverage increases the
                            risk of liquidation.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function PositionInfoModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-medium">
                        Position Mode
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                        Your position on this coin is either short or long.
                        Orders specify a size and direction only; there is no
                        distinction between open and close when placing an
                        order.
                    </p>

                    <Button
                        className="w-full bg-gradient text-gray-800 font-medium"
                        onClick={onClose}
                    >
                        Understood
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface OrderFormProps {
    tradingState: TradingState;
    onStateChange: (updates: Partial<TradingState>) => void;
    onOptionChange: (option: OrderOption) => void;
}

function MarketOrderForm({
    tradingState,
    onStateChange,
    onOptionChange,
}: OrderFormProps) {
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="px-3 h-full flex flex-col gap-2 flex-1">
                <PositionSelector
                    selectedPosition={tradingState.selectedPosition}
                    onPositionChange={(position) =>
                        onStateChange({ selectedPosition: position })
                    }
                />
                <AccountInfo />
                <SizeInput />
                <SizeSlider
                    tradingState={tradingState}
                    onStateChange={onStateChange}
                />
                <OrderOptions
                    selectedOption={tradingState.selectedOption}
                    onOptionChange={onOptionChange}
                />
                <TakeProfitStopLoss />
            </div>
            <OrderSummary />
        </div>
    );
}

function LimitOrderForm({
    tradingState,
    onStateChange,
    onOptionChange,
}: OrderFormProps) {
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="px-3 h-full flex flex-col gap-2 flex-1">
                <PositionSelector
                    selectedPosition={tradingState.selectedPosition}
                    onPositionChange={(position) =>
                        onStateChange({ selectedPosition: position })
                    }
                />
                <AccountInfo />
                <PriceInput />
                <SizeInput />
                <SizeSlider
                    tradingState={tradingState}
                    onStateChange={onStateChange}
                />
                <LimitOrderOptions
                    selectedOption={tradingState.selectedOption}
                    onOptionChange={onOptionChange}
                />
                <TakeProfitStopLoss />
            </div>
            <OrderSummary isLimit />
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
        <div className="my-2 p-0.5 grid grid-cols-2 items-center bg-gray-600 rounded-md">
            <span
                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                    selectedPosition === "long"
                        ? "bg-gradient text-gray-800"
                        : "bg-transparent text-gray-50"
                }`}
                onClick={() => onPositionChange("long")}
            >
                Buy / Long
            </span>
            <span
                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                    selectedPosition === "short"
                        ? "bg-gradient text-gray-800"
                        : "bg-transparent text-gray-50"
                }`}
                onClick={() => onPositionChange("short")}
            >
                Sell / Short
            </span>
        </div>
    );
}

function AccountInfo() {
    return (
        <div className="grid grid-cols-1 gap-1.5 items-center text-xs text-nowrap">
            <div className="flex items-center justify-between">
                <span className="text-slate-400">Available to Trade</span>
                <span>0.00</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Position</span>
                <span>0.00 CHILLGUY</span>
            </div>
        </div>
    );
}

function PriceInput() {
    return (
        <div className="px-3 py-1 flex items-center gap-1.5 border rounded-md text-nowrap">
            <span className="text-slate-400 text-xs">Price (USD)</span>
            <Input
                type="number"
                className="py-1 h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
            />
            <div className="flex items-center gap-3 text-xs">Mid</div>
        </div>
    );
}

function SizeInput() {
    return (
        <div className="px-3 py-1 flex items-center gap-1.5 border rounded-md">
            <span className="text-slate-400 text-xs">Size</span>
            <Input
                type="number"
                className="py-1 h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
            />
            <div className="flex items-center gap-3">
                <CustomSelect
                    options={PAIR_OPTIONS}
                    defaultValue="CHILLGUY"
                    className="min-w-21"
                    left={false}
                />
            </div>
        </div>
    );
}

function SizeSlider({
    tradingState,
    onStateChange,
}: {
    tradingState: TradingState;
    onStateChange: (updates: Partial<TradingState>) => void;
}) {
    // Get the current percentage value from trading state, default to 0
    const currentPercentage = tradingState.sizePercentage || 0;

    const handleSliderChange = (value: number[]) => {
        onStateChange({ sizePercentage: value[0] });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(100, Math.max(0, Number(e.target.value)));
        onStateChange({ sizePercentage: value });
    };

    return (
        <div className="flex items-center gap-2.5">
            <Slider
                className="z-10"
                value={[currentPercentage]}
                onValueChange={handleSliderChange}
                max={100}
                min={0}
                step={1}
            />
            <div className="w-15 px-2 flex items-center gap-2 border rounded-md">
                <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={currentPercentage}
                    onChange={handleInputChange}
                    className="py-1.5 px-0 w-fit h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                />
                <span className="text-xs">%</span>
            </div>
        </div>
    );
}

function OrderOptions({
    selectedOption,
    onOptionChange,
}: {
    selectedOption: OrderOption;
    onOptionChange: (option: OrderOption) => void;
}) {
    return (
        <div className="flex flex-col items-start justify-center gap-1.5">
            <CheckboxOption
                id="reduce-only"
                label="Reduce Only"
                checked={selectedOption === "reduce-only"}
                onChange={() => onOptionChange("reduce-only")}
            />
            <CheckboxOption
                id="take-profit-stop-loss"
                label="Take Profit / Stop Loss"
                checked={selectedOption === "take-profit-stop-loss"}
                onChange={() => onOptionChange("take-profit-stop-loss")}
            />
        </div>
    );
}

function LimitOrderOptions({
    selectedOption,
    onOptionChange,
}: {
    selectedOption: OrderOption;
    onOptionChange: (option: OrderOption) => void;
}) {
    return (
        <div className="flex flex-col items-start justify-center gap-1.5">
            <div className="w-full flex items-center justify-between">
                <CheckboxOption
                    id="reduce-only"
                    label="Reduce Only"
                    checked={selectedOption === "reduce-only"}
                    onChange={() => onOptionChange("reduce-only")}
                />
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">TIF</span>
                    <CustomSelect
                        options={[
                            {
                                label: "GTC",
                                value: "GTC",
                            },
                            {
                                label: "IOC",
                                value: "IOC",
                            },
                            {
                                label: "ALO",
                                value: "ALO",
                            },
                        ]}
                        defaultValue="GTC"
                        gap="2"
                        className="min-w-11"
                        dropdownMinWidth="100%"
                    />
                </div>
            </div>
            <CheckboxOption
                id="take-profit-stop-loss"
                label="Take Profit / Stop Loss"
                checked={selectedOption === "take-profit-stop-loss"}
                onChange={() => onOptionChange("take-profit-stop-loss")}
            />
        </div>
    );
}

function CheckboxOption({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={onChange}
                className="border-slate-600 data-[state=checked]:bg-gray-200 data-[state=checked]:border-gray-200"
            />
            <Label
                htmlFor={id}
                className="text-white text-xs font-medium cursor-pointer"
            >
                {label}
            </Label>
        </div>
    );
}

function TakeProfitStopLoss() {
    return (
        <>
            <div className="grid grid-cols-2 gap-2.5">
                <TPSLInput label="TP Price" />
                <TPSLInput label="Gain" hasDropdown />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                <TPSLInput label="SL Price" />
                <TPSLInput label="Loss" hasDropdown />
            </div>
        </>
    );
}

function TPSLInput({
    label,
    hasDropdown = false,
}: {
    label: string;
    hasDropdown?: boolean;
}) {
    return (
        <div
            className={`w-full ${
                hasDropdown ? "px-2.5" : "px-3"
            } flex items-center gap-${
                hasDropdown ? "1.5" : "2"
            } border rounded-md`}
        >
            <span className="text-slate-400 text-xs text-nowrap">{label}</span>
            <Input
                type="number"
                min={0}
                max={100}
                step={1}
                className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
            />
            {hasDropdown && (
                <CustomSelect
                    options={[
                        {
                            label: "%",
                            value: "%",
                        },
                        {
                            label: "$",
                            value: "$",
                        },
                    ]}
                    defaultValue="%"
                    gap="2"
                    className="min-w-8"
                    dropdownMinWidth="100%"
                />
            )}
        </div>
    );
}

function OrderSummary({ isLimit = false }: { isLimit?: boolean }) {
    return (
        <div className="p-2.5 flex flex-col items-stretch gap-2.5">
            <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                Connect
            </Button>
            <Separator className="bg-slate-400" />
            <div className="flex flex-col gap-2.5 justify-center">
                <SummaryRow label="Liquidation Price" value="N/A" />
                <SummaryRow label="Order Value" value="N/A" />
                <SummaryRow label="Margin Required" value="N/A" />
                {!isLimit && (
                    <SummaryRow label="Slippage" value="Est: 0% / Max: 8.00%" />
                )}
                <SummaryRow label="Fees" value="0.0450% / 0.0150%" />
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{label}</span>
            <span>{value}</span>
        </div>
    );
}
