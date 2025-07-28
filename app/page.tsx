"use client";

import { useState } from "react";
import StarIcon from "@/components/icons/StarIcon";
import {
    ChevronDown,
    DollarSign,
    Percent,
    SquareArrowOutUpRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Chart from "@/components/features/Chart";
import CustomSelect from "@/components/ui/custom-select";

const proOptions = [
    {
        label: "Scale",
        value: "scale",
    },
    {
        label: "Stop Limit",
        value: "stop-limit",
    },
    {
        label: "Stop Market",
        value: "stop-market",
    },
    {
        label: "TWAP",
        value: "twap",
    },
];

const priceStepOptions = [
    {
        label: "0.000001",
        value: "0.000001",
    },
    {
        label: "0.000002",
        value: "0.000002",
    },
    {
        label: "0.000005",
        value: "0.000005",
    },
    {
        label: "0.00001",
        value: "0.00001",
    },
    {
        label: "0.0001",
        value: "0.0001",
    },
    {
        label: "0.001",
        value: "0.001",
    },
];

const pairOptions = [
    {
        label: "CHILLGUY",
        value: "CHILLGUY",
    },
    {
        label: "USD",
        value: "USD",
    },
];

export default function Home() {
    const [selectedFavorite, setSelectedFavorite] = useState<
        "dollar" | "percent"
    >("percent");
    const [selectedPosition, setSelectedPosition] = useState<"long" | "short">(
        "long"
    );
    const [selectedOption, setSelectedOption] = useState<
        "reduce-only" | "take-profit-stop-loss" | null
    >(null);
    const [selectedPriceStepOption, setSelectedPriceStepOption] =
        useState<string>("0.001");

    const handleOptionChange = (
        option: "reduce-only" | "take-profit-stop-loss"
    ) => {
        // If the same option is clicked, deselect it. Otherwise, select the new option
        setSelectedOption(selectedOption === option ? null : option);
    };

    return (
        <div className="max-w-[100vw] min-h-screen">
            <div className="grid gap-1 max-w-full mx-auto grid-cols-1 md:grid-cols-1 lg:grid-cols-[785fr_312fr] xl:grid-cols-[895fr_266fr_266fr]">
                <div className="space-y-1 h-[670px]">
                    <div className="px-3 py-1 w-full grid grid-cols-[auto_auto_1fr] items-center gap-2 overflow-hidden bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md">
                        <StarIcon className="w-3 h-3 text-yellow-500" />
                        <div className="p-0.5 flex items-center bg-gray-600 rounded-md">
                            <span
                                className={`p-1.5 border rounded-md cursor-pointer border-none ${
                                    selectedFavorite === "dollar"
                                        ? "bg-gradient text-gray-800"
                                        : "bg-transparent text-gray-50"
                                }`}
                                onClick={() => setSelectedFavorite("dollar")}
                            >
                                <DollarSign className="w-3 h-3" />
                            </span>
                            <span
                                className={`p-1.5 border rounded-md cursor-pointer border-none ${
                                    selectedFavorite === "percent"
                                        ? "bg-gradient text-gray-800"
                                        : "bg-transparent text-gray-50"
                                }`}
                                onClick={() => setSelectedFavorite("percent")}
                            >
                                <Percent className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="w-full flex items-center overflow-x-auto hide-scrollbar text-nowrap">
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>AAVE-USD</span>
                                <span>+0.19%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ACE-USD</span>
                                <span>+4.28%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ADA-USD</span>
                                <span>-0.28%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ALGO-USD</span>
                                <span>-1.23%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>AAVE-USD</span>
                                <span>+0.19%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ACE-USD</span>
                                <span>+4.28%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ADA-USD</span>
                                <span>-0.28%</span>
                            </div>
                            <div className="flex items-center p-2 gap-1 text-xs">
                                <span>ALGO-USD</span>
                                <span>-1.23%</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-2 w-full grid grid-cols-[repeat(2,auto)] gap-8 items-center bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md">
                        {/* Token Pair */}
                        <div className="flex items-center py-2 gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-sky-400"></div>
                                <span className="text-xl text-nowrap">
                                    CHILLGUY-USD
                                </span>
                            </div>
                            <span>
                                <ChevronDown className="w-5 h-5" />
                            </span>
                        </div>
                        {/* Infomation */}
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="overflow-x-auto hide-scrollbar grid grid-cols-[repeat(6,auto)] gap-8 items-center text-nowrap">
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        Mark
                                    </span>
                                    <span className="text-xs">0.078231</span>
                                </div>
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        Oracle
                                    </span>
                                    <span className="text-xs">0.077800</span>
                                </div>
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        24h Change
                                    </span>
                                    <span className="text-xs">
                                        +0.001470 / +1.92%
                                    </span>
                                </div>
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        24h Volume
                                    </span>
                                    <span className="text-xs">
                                        $4,777,133.67
                                    </span>
                                </div>
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        Open Interest
                                    </span>
                                    <span className="text-xs">
                                        $5,072,670.18
                                    </span>
                                </div>
                                <div className="grid grid-rows-2 gap-1">
                                    <span className="text-slate-400 text-xs">
                                        Funding / Countdown
                                    </span>
                                    <span className="text-xs">
                                        <div className="inline-block">
                                            <span>0.0013%</span>
                                        </div>
                                        &nbsp; 00:59:53
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-transparent via-white/10 to-white/5 rounded-md w-full h-[561px]">
                        <Chart />
                    </div>
                </div>
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
                            <div className="px-2.5 py-2 flex items-center justify-between">
                                <CustomSelect
                                    options={priceStepOptions}
                                    defaultValue="0.001"
                                    className="min-w-20"
                                />
                                <CustomSelect
                                    options={pairOptions}
                                    defaultValue="CHILLGUY"
                                    className="min-w-21"
                                    left={false}
                                />
                            </div>
                            <div className="px-2.5 mb-2">
                                <div className="grid grid-cols-[20%_40%_40%]">
                                    <span className="text-xs text-slate-400 text-left">
                                        Price
                                    </span>
                                    <span className="text-xs text-slate-400 text-right">
                                        Size (CHILLGUY)
                                    </span>
                                    <span className="text-xs text-slate-400 text-right">
                                        Total (CHILLGUY)
                                    </span>
                                </div>
                            </div>
                            <div className="min-h-0">
                                <div className="h-full grid grid-rows-[1fr_26px_1fr]">
                                    <div className="flex flex-col justify-around gap-1">
                                        {[...Array(11)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                                            >
                                                <span className="pl-2.5 text-xs text-red-400">
                                                    0.075945
                                                </span>
                                                <span className="text-xs text-right pr-1">
                                                    38,898
                                                </span>
                                                <span className="pr-2.5 text-xs text-right">
                                                    430,017
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="my-1 flex gap-8 justify-center items-center text-xs bg-gray-700">
                                        <span>Spread</span>
                                        <span>0.000085</span>
                                        <span>0.078%</span>
                                    </div>
                                    <div className="flex flex-col justify-around gap-1">
                                        {[...Array(11)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                                            >
                                                <span className="pl-2.5 text-xs text-green-400">
                                                    0.075945
                                                </span>
                                                <span className="text-xs text-right pr-1">
                                                    38,898
                                                </span>
                                                <span className="pr-2.5 text-xs text-right">
                                                    430,017
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent
                            className="text-white h-[calc(100%-49px)]"
                            value="trades"
                        >
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
                                {/* Trade Data */}
                                <div className="min-h-0 h-[calc(670px-65px)]">
                                    <div className="flex flex-col justify-around gap-1 h-[calc(100%-16px)] w-full overflow-auto hide-scrollbar -mt-1">
                                        {[...Array(50)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="py-0.5 relative cursor-pointer grid grid-cols-[20%_40%_40%]"
                                            >
                                                <span className="pl-2.5 text-xs text-green-400">
                                                    0.075945
                                                </span>
                                                <span className="text-xs text-right pr-1">
                                                    38,898
                                                </span>
                                                <span className="flex items-center justify-end gap-1 pr-2.5 text-xs">
                                                    <span>15:31:27</span>
                                                    <Link href="#">
                                                        <SquareArrowOutUpRight className="w-3 h-3" />
                                                    </Link>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[670px]">
                    <div className="h-full flex flex-col items-center">
                        <div className="pt-3 grid grid-cols-3 gap-3 items-center">
                            <Button className="py-2 w-18 h-fit text-xs bg-gradient text-gray-800">
                                Cross
                            </Button>
                            <Button className="py-2 w-18 h-fit text-xs bg-gradient text-gray-800">
                                3x
                            </Button>
                            <Button className="py-2 w-18 h-fit text-xs bg-gradient text-gray-800">
                                One-Way
                            </Button>
                        </div>

                        <Tabs
                            defaultValue="market"
                            className="w-full gap-0 flex-1"
                        >
                            <TabsList
                                variant="custom"
                                className="px-3 w-full h-fit text-nowrap flex-nowrap hide-scrollbar"
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
                                    className="px-0 py-2.5 text-xs flex items-center gap-2"
                                >
                                    Stop Market
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="text-white h-[calc(100%-49px)"
                                value="market"
                            >
                                <div className="h-full flex flex-col justify-between">
                                    <div className="px-3 h-full flex flex-col gap-2 flex-1">
                                        <div className="my-2 p-0.5 grid grid-cols-2 items-center bg-gray-600 rounded-md">
                                            <span
                                                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                                                    selectedPosition === "long"
                                                        ? "bg-gradient text-gray-800"
                                                        : "bg-transparent text-gray-50"
                                                }`}
                                                onClick={() =>
                                                    setSelectedPosition("long")
                                                }
                                            >
                                                Buy / Long
                                            </span>
                                            <span
                                                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                                                    selectedPosition === "short"
                                                        ? "bg-gradient text-gray-800"
                                                        : "bg-transparent text-gray-50"
                                                }`}
                                                onClick={() =>
                                                    setSelectedPosition("short")
                                                }
                                            >
                                                Sell / Short
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5 items-center text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">
                                                    Available to Trade
                                                </span>
                                                <span>0.00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">
                                                    Current Position
                                                </span>
                                                <span>0.00 CHILLGUY</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 flex items-center gap-1.5 border rounded-md">
                                            <span className="text-slate-400 text-xs">
                                                Size
                                            </span>
                                            <Input
                                                type="number"
                                                className="py-1 h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                            />
                                            <div className="flex items-center gap-3">
                                                <CustomSelect
                                                    options={pairOptions}
                                                    defaultValue="CHILLGUY"
                                                    className="min-w-21"
                                                    left={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Slider className="z-10" />
                                            <div className="w-15 px-3 flex items-center gap-2 border rounded-md">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-fit h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                                <span className="text-xs">
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start justify-center gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="reduce-only"
                                                    checked={
                                                        selectedOption ===
                                                        "reduce-only"
                                                    }
                                                    onCheckedChange={() =>
                                                        handleOptionChange(
                                                            "reduce-only"
                                                        )
                                                    }
                                                    className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                                <Label
                                                    htmlFor="reduce-only"
                                                    className="text-white text-xs font-medium cursor-pointer"
                                                >
                                                    Reduce Only
                                                </Label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="take-profit-stop-loss"
                                                    checked={
                                                        selectedOption ===
                                                        "take-profit-stop-loss"
                                                    }
                                                    onCheckedChange={() =>
                                                        handleOptionChange(
                                                            "take-profit-stop-loss"
                                                        )
                                                    }
                                                    className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                                <Label
                                                    htmlFor="take-profit-stop-loss"
                                                    className="text-white text-xs font-medium cursor-pointer"
                                                >
                                                    Take Profit / Stop Loss
                                                </Label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="w-full px-3 flex items-center gap-2 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    TP Price
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                            </div>
                                            <div className="w-full px-2.5 flex items-center gap-1.5 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    Gain
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
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
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="w-full px-3 flex items-center gap-2 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    SL Price
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                            </div>
                                            <div className="w-full px-2.5 flex items-center gap-1.5 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    Loss
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2.5 flex flex-col items-stretch gap-2.5">
                                        <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                                            Connect
                                        </Button>
                                        <Separator className="bg-slate-400" />
                                        <div className="flex flex-col gap-2.5 justify-center">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Liquidation Price
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Order Value
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Margin Required
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Slippage
                                                </span>
                                                <span>
                                                    Est: 0% / Max: 8.00%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Fees
                                                </span>
                                                <span>0.0450% / 0.0150%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent
                                className="text-white h-[calc(100%-49px)"
                                value="limit"
                            >
                                <div className="h-full flex flex-col justify-between">
                                    <div className="px-3 h-full flex flex-col gap-2 flex-1">
                                        <div className="my-2 p-0.5 grid grid-cols-2 items-center bg-gray-600 rounded-md">
                                            <span
                                                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                                                    selectedPosition === "long"
                                                        ? "bg-gradient text-gray-800"
                                                        : "bg-transparent text-gray-50"
                                                }`}
                                                onClick={() =>
                                                    setSelectedPosition("long")
                                                }
                                            >
                                                Buy / Long
                                            </span>
                                            <span
                                                className={`py-1.5 text-xs border-none rounded-md cursor-pointer ${
                                                    selectedPosition === "short"
                                                        ? "bg-gradient text-gray-800"
                                                        : "bg-transparent text-gray-50"
                                                }`}
                                                onClick={() =>
                                                    setSelectedPosition("short")
                                                }
                                            >
                                                Sell / Short
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5 items-center text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">
                                                    Available to Trade
                                                </span>
                                                <span>0.00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">
                                                    Current Position
                                                </span>
                                                <span>0.00 CHILLGUY</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 flex items-center gap-1.5 border rounded-md text-nowrap">
                                            <span className="text-slate-400 text-xs">
                                                Price (USD)
                                            </span>
                                            <Input
                                                type="number"
                                                className="py-1 h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                            />
                                            <div className="flex items-center gap-3 text-xs">
                                                Mid
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 flex items-center gap-1.5 border rounded-md text-nowrap">
                                            <span className="text-slate-400 text-xs">
                                                Size
                                            </span>
                                            <Input
                                                type="number"
                                                className="py-1 h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                            />
                                            <CustomSelect
                                                options={pairOptions}
                                                defaultValue="CHILLGUY"
                                                className="min-w-21"
                                                left={false}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Slider className="z-10" />
                                            <div className="w-15 px-3 flex items-center gap-2 border rounded-md">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-fit h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                                <span className="text-xs">
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start justify-center gap-1.5">
                                            <div className="w-full flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="reduce-only"
                                                        checked={
                                                            selectedOption ===
                                                            "reduce-only"
                                                        }
                                                        onCheckedChange={() =>
                                                            handleOptionChange(
                                                                "reduce-only"
                                                            )
                                                        }
                                                        className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                    />
                                                    <Label
                                                        htmlFor="reduce-only"
                                                        className="text-white text-xs font-medium cursor-pointer"
                                                    >
                                                        Reduce Only
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-xs">
                                                        TIF
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs">
                                                            ALO
                                                        </span>
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="take-profit-stop-loss"
                                                    checked={
                                                        selectedOption ===
                                                        "take-profit-stop-loss"
                                                    }
                                                    onCheckedChange={() =>
                                                        handleOptionChange(
                                                            "take-profit-stop-loss"
                                                        )
                                                    }
                                                    className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                                <Label
                                                    htmlFor="take-profit-stop-loss"
                                                    className="text-white text-xs font-medium cursor-pointer"
                                                >
                                                    Take Profit / Stop Loss
                                                </Label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="w-full px-3 flex items-center gap-2 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    TP Price
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                            </div>
                                            <div className="w-full px-2.5 flex items-center gap-1.5 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    Gain
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">
                                                        %
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="w-full px-3 flex items-center gap-2 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    SL Price
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                            </div>
                                            <div className="w-full px-2.5 flex items-center gap-1.5 border rounded-md">
                                                <span className="text-slate-400 text-xs text-nowrap">
                                                    Loss
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    className="py-1.5 px-0 w-full h-fit text-right border-none hide-number-stepper text-xs md:text-xs"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">
                                                        %
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2.5 flex flex-col items-stretch gap-2.5">
                                        <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                                            Connect
                                        </Button>
                                        <Separator className="bg-slate-400" />
                                        <div className="flex flex-col gap-2.5 justify-center">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Liquidation Price
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Order Value
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Margin Required
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            {/* <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Slippage
                                                </span>
                                                <span>
                                                    Est: 0% / Max: 8.00%
                                                </span>
                                            </div> */}
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Fees
                                                </span>
                                                <span>0.0450% / 0.0150%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[459px]">
                    <Tabs
                        defaultValue="balances"
                        className="w-full gap-0 flex-1"
                    >
                        <div className="px-3 w-full overflow-auto grid grid-cols-[auto_1fr_auto]">
                            <TabsList
                                variant="custom"
                                className="px-0 py-0 w-full h-fit text-nowrap overflow-x-auto flex-nowrap hide-scrollbar border-b border-slate-700 rounded-none"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                <TabsTrigger
                                    variant="custom"
                                    value="balances"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Balances
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="positions"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Positions
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="open-orders"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Open Orders
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="twap"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    TWAP
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="trade-history"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Trade History
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="funding-history"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Funding History
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="custom"
                                    value="order-history"
                                    className="px-3 py-2.5 text-xs"
                                >
                                    Order History
                                </TabsTrigger>
                            </TabsList>
                            <div className="border-b border-slate-700" />
                            <div className="flex items-center gap-3 border-b border-slate-700">
                                <span className="text-xs">Filter</span>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <TabsContent
                            className="px-3 py-1 text-white"
                            value="balances"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="">
                                            <th className="w-[12%] max-w-[12%] text-left text-slate-400 text-xs/6 font-normal">
                                                Coin
                                            </th>
                                            <th className="w-[14%] max-w-[14%] text-left text-slate-400 text-xs/6 font-normal">
                                                Total Balance
                                            </th>
                                            <th className="w-[14%] max-w-[14%] text-left text-slate-400 text-xs/6 font-normal">
                                                Available Balance
                                            </th>
                                            <th className="w-[12%] max-w-[12%] text-left text-slate-400 text-xs/6 font-normal">
                                                <div className="flex flex-row gap-1 justify-start items-center">
                                                    <span>USDC Value</span>
                                                    <ChevronDown className="inline w-3 h-3" />
                                                </div>
                                            </th>
                                            <th className="w-[12%] max-w-[12%] text-left text-slate-400 text-xs/6 font-normal">
                                                PNL (ROE %)
                                            </th>
                                            <th className="w-[10%] max-w-[10%] text-left text-slate-400 text-xs/6 font-normal">
                                                Send
                                            </th>
                                            <th className="w-[14%] max-w-[14%] text-left text-slate-400 text-xs/6 font-normal">
                                                Transfer
                                            </th>
                                            <th className="w-[12%] max-w-[12%] text-left text-slate-400 text-xs/6 font-normal">
                                                Contract
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-xs/6 text-left"
                                            >
                                                No balances yet
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                        <TabsContent
                            className="px-3 py-1 text-white"
                            value="positions"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="">
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Coin
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Size
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                <div className="flex flex-row gap-1 justify-start items-center">
                                                    <span>Position Value</span>
                                                    <ChevronDown className="inline w-3 h-3" />
                                                </div>
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Entry Price
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Mark Price
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                PNL (ROE %)
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Liq. Price
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                Margin
                                            </th>
                                            <th className="w-[7%] max-w-[7%] text-left text-slate-400 text-xs/6 font-normal">
                                                Funding
                                            </th>
                                            <th className="w-[11%] max-w-[11%] text-left text-slate-400 text-xs/6 font-normal">
                                                Close All
                                            </th>
                                            <th className="w-[9%] max-w-[9%] text-left text-slate-400 text-xs/6 font-normal">
                                                TP/SL
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-xs/6 text-left"
                                            >
                                                No open positions yet
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="col-span-1 bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[459px]">
                    <div className="p-2.5 flex flex-col h-full w-full gap-3">
                        <div className="flex flex-col items-stretch gap-2">
                            <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                                Connect
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                                    Spot
                                </Button>
                                <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                                    Withdraw
                                </Button>
                            </div>
                        </div>
                        <Separator className="bg-slate-400" />
                        <div className="flex flex-col gap-3 text-left">
                            <div className="flex flex-col gap-2.5">
                                <h6 className="text-xs">Account Equity</h6>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Spot</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Perps
                                    </span>
                                    <span>$0.00</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <h6 className="text-xs">Perps Overview</h6>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Balance
                                    </span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Unrealized PNL
                                    </span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Cross Margin Ratio
                                    </span>
                                    <span>0.00%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Maintenance Margin
                                    </span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Cross Account Leverage
                                    </span>
                                    <span>0.00x</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
