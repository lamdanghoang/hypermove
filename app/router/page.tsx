"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BTCFI_DATA, Protocol } from "@/data/btcfi-data";
import {
    calculateOptimizedRoutes,
    OptimizedRoute,
    Allocation,
} from "@/lib/route-optimizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

function RouteOptimizerContent() {
    const searchParams = useSearchParams();
    const [btcAmount, setBtcAmount] = useState(
        searchParams.get("btcAmount") || "5.0"
    );
    const [riskTolerance, setRiskTolerance] = useState(
        searchParams.get("riskPreference") || "balanced"
    );
    const [timeHorizon, setTimeHorizon] = useState("365");
    const [includeNative, setIncludeNative] = useState(true);
    const [includeWrapped, setIncludeWrapped] = useState(true);
    const [minApy, setMinApy] = useState(0);

    const [activeTab, setActiveTab] = useState("native");
    const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const btc = searchParams.get("btcAmount");
        const risk = searchParams.get("riskPreference");
        if (btc && risk) {
            handleGenerateRoutes();
        }
    }, [searchParams]);

    const handleGenerateRoutes = () => {
        setLoading(true);
        setTimeout(() => {
            const generatedRoutes = calculateOptimizedRoutes(
                parseFloat(btcAmount),
                riskTolerance,
                includeNative,
                includeWrapped,
                minApy
            );
            setRoutes(generatedRoutes);
            setLoading(false);
        }, 1500); // Simulate loading time
    };

    const getProtocolsForTab = () => {
        if (activeTab === "native") {
            return BTCFI_DATA.native_btc;
        } else if (activeTab === "wrapped") {
            return BTCFI_DATA.wrapped_btc;
        } else {
            return [...BTCFI_DATA.native_btc, ...BTCFI_DATA.wrapped_btc];
        }
    };

    const protocols = getProtocolsForTab();

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    BTCFi Route Optimizer
                </h1>
                <p className="text-slate-400">
                    Maximize your Bitcoin returns across native and wrapped
                    protocols
                </p>
            </header>

            {/* Route Input Section */}
            <div className="mb-8">
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Route Configuration
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label>BTC Amount</Label>
                                    <Input
                                        type="number"
                                        value={btcAmount}
                                        onChange={(e) =>
                                            setBtcAmount(e.target.value)
                                        }
                                        className="w-full bg-gray-50 text-gray-800 hide-number-stepper"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Risk Tolerance</Label>
                                    <Select
                                        value={riskTolerance}
                                        onValueChange={setRiskTolerance}
                                    >
                                        <SelectTrigger className="w-full bg-gray-50 text-gray-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="conservative">
                                                Conservative
                                            </SelectItem>
                                            <SelectItem value="balanced">
                                                Balanced
                                            </SelectItem>
                                            <SelectItem value="aggressive">
                                                Aggressive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Time Horizon</Label>
                                    <Select
                                        value={timeHorizon}
                                        onValueChange={setTimeHorizon}
                                    >
                                        <SelectTrigger className="w-full bg-gray-50 text-gray-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">
                                                1 Month
                                            </SelectItem>
                                            <SelectItem value="90">
                                                3 Months
                                            </SelectItem>
                                            <SelectItem value="180">
                                                6 Months
                                            </SelectItem>
                                            <SelectItem value="365">
                                                1 Year
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <Label>Bitcoin Type</Label>
                                    <div className="flex space-x-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="native-btc"
                                                checked={includeNative}
                                                onCheckedChange={(checked) =>
                                                    setIncludeNative(!!checked)
                                                }
                                                className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=unchecked]:bg-white"
                                            />
                                            <Label htmlFor="native-btc">
                                                Native BTC
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="wrapped-btc"
                                                checked={includeWrapped}
                                                onCheckedChange={(checked) =>
                                                    setIncludeWrapped(!!checked)
                                                }
                                                className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=unchecked]:bg-white"
                                            />
                                            <Label htmlFor="wrapped-btc">
                                                Wrapped BTC
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <Label>
                                        Min APY:{" "}
                                        <span className="text-teal-400 font-semibold">
                                            {minApy}%
                                        </span>
                                    </Label>
                                    <Slider
                                        value={[minApy]}
                                        onValueChange={(value) =>
                                            setMinApy(value[0])
                                        }
                                        max={20}
                                        step={1}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleGenerateRoutes}
                                className="bg-gradient text-gray-800 self-center"
                                disabled={loading}
                            >
                                {loading
                                    ? "Generating..."
                                    : "🎯 Generate Optimized Routes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Optimizing your routes...</p>
                </div>
            )}
            {!loading && routes.length > 0 && (
                <RouteResults
                    routes={routes}
                    btcAmount={parseFloat(btcAmount)}
                />
            )}

            {/* Protocol Comparison Engine */}
            <div className="mb-8">
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Protocol Comparison Engine
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-lg mb-4">
                            <TabButton
                                label="Native BTC"
                                isActive={activeTab === "native"}
                                onClick={() => setActiveTab("native")}
                            />
                            <TabButton
                                label="Wrapped BTC"
                                isActive={activeTab === "wrapped"}
                                onClick={() => setActiveTab("wrapped")}
                            />
                            <TabButton
                                label="All Protocols"
                                isActive={activeTab === "all"}
                                onClick={() => setActiveTab("all")}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {protocols.map((protocol) => (
                                <ProtocolComparisonCard
                                    key={protocol.protocol}
                                    protocol={protocol}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RouteResults({
    routes,
    btcAmount,
}: {
    routes: OptimizedRoute[];
    btcAmount: number;
}) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-4">
                📊 Optimized Route Options
            </h2>
            <div className="flex flex-col gap-6">
                {routes.map((route, index) => (
                    <div
                        key={index}
                        className={`bg-slate-800/50 rounded-lg shadow-lg p-6 border-2 ${
                            index === 0
                                ? "border-teal-500"
                                : "border-slate-700/50"
                        }`}
                    >
                        {index === 0 && (
                            <div className="text-sm font-bold text-teal-400 mb-2">
                                🏆 Best Yield
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {route.name}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    {route.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-400">
                                    {route.total_apy}%
                                </div>
                                <div className="text-sm text-slate-400">
                                    Risk: {route.risk_score}/10
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {route.allocation.map((alloc) => (
                                <AllocationItem
                                    key={alloc.protocol}
                                    alloc={alloc}
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center p-4 bg-slate-900/50 rounded-lg">
                            <SummaryItem
                                label="Annual Yield"
                                value={`$${Math.round(
                                    route.annual_yield
                                ).toLocaleString()}`}
                            />
                            <SummaryItem
                                label="Monthly Yield"
                                value={`$${Math.round(
                                    route.monthly_yield
                                ).toLocaleString()}`}
                            />
                            <SummaryItem
                                label="Protocols"
                                value={route.allocation.length}
                            />
                            <SummaryItem
                                label="Complexity"
                                value={
                                    route.allocation.length <= 3
                                        ? "Simple"
                                        : "Advanced"
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AllocationItem({ alloc }: { alloc: Allocation }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-md">
            <div className="text-2xl">{alloc.logo}</div>
            <div className="flex-grow">
                <div className="font-semibold">{alloc.protocol}</div>
                <div className="text-xs text-slate-400">{alloc.type}</div>
            </div>
            <div className="text-right">
                <div className="font-bold">{alloc.percentage}%</div>
                <div className="text-xs text-green-400">{alloc.apy}% APY</div>
            </div>
        </div>
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div>
            <div className="text-xs text-slate-400 uppercase">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}

function TabButton({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            onClick={onClick}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? "bg-gradient text-gray-800"
                    : "text-slate-400 hover:bg-slate-700/50 bg-transparent"
            }`}
        >
            {label}
        </Button>
    );
}

function ProtocolComparisonCard({ protocol }: { protocol: Protocol }) {
    return (
        <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-4">
                <div className="text-2xl">{protocol.logo}</div>
                <div>
                    <h4 className="font-bold">{protocol.protocol}</h4>
                    <p className="text-sm text-slate-400">{protocol.type}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Current APY</span>
                    <span className="font-semibold text-green-400">
                        {protocol.current_apy}%
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">APY Range</span>
                    <span className="font-semibold">
                        {protocol.apy_min}% - {protocol.apy_max}%
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">TVL</span>
                    <span className="font-semibold">{protocol.tvl}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Risk Level</span>
                    <span
                        className={`font-semibold ${
                            protocol.risk_level.toLowerCase().includes("low")
                                ? "text-green-400"
                                : protocol.risk_level
                                      .toLowerCase()
                                      .includes("medium")
                                ? "text-yellow-400"
                                : "text-red-400"
                        }`}
                    >
                        {protocol.risk_level}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Security Score</span>
                    <span className="font-semibold">
                        {protocol.security_score}/10
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function RouteOptimizerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouteOptimizerContent />
        </Suspense>
    );
}
