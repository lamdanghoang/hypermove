"use client";

import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { BTCFI_DATA } from "@/data/btcfi-data";

export default function PortfolioPage() {
    const { user_portfolio } = BTCFI_DATA;

    // Sample current portfolio allocation
    const currentAllocation = [
        { protocol: "Babylon Labs", btc: 3.15, apy: 6.2 },
        { protocol: "Stacks sBTC", btc: 2.63, apy: 7.8 },
        { protocol: "wBTC Uniswap", btc: 2.1, apy: 11.5 },
        { protocol: "Lombard LBTC", btc: 1.58, apy: 7.2 },
        { protocol: "CoreDAO", btc: 1.05, apy: 4.5 },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Portfolio Management
                </h1>
                <p className="text-slate-400">
                    Detailed breakdown and performance analysis
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Current Allocation */}
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Current Allocation
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {currentAllocation.map((item) => (
                            <div
                                key={item.protocol}
                                className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg"
                            >
                                <div>
                                    <div className="font-bold">
                                        {item.protocol}
                                    </div>
                                    <div className="text-sm text-green-400">
                                        {item.apy}% APY
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold">
                                        ₿{item.btc}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        $
                                        {(
                                            item.btc * BTCFI_DATA.btc_price
                                        ).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {(
                                            (item.btc /
                                                user_portfolio.total_btc) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historical Performance */}
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Historical Performance
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="h-[300px]">
                            <PerformanceChart />
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Insights */}
            <div className="bg-slate-800/50 rounded-lg shadow-lg">
                <div className="p-6 border-b border-slate-700/50">
                    <h3 className="text-xl font-bold">Portfolio Insights</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">
                            Native vs Wrapped Split
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Native BTC
                                </span>
                                <span className="font-semibold">67%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Wrapped BTC
                                </span>
                                <span className="font-semibold">33%</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Risk Distribution</h4>
                        <div className="space-y-2">
                            <RiskBar label="Low Risk" percentage={45} />
                            <RiskBar label="Medium Risk" percentage={40} />
                            <RiskBar label="High Risk" percentage={15} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskBar({ label, percentage }: { label: string; percentage: number }) {
    return (
        <div className="flex items-center space-x-4 text-sm">
            <span className="w-24 text-slate-400">{label}</span>
            <div className="flex-1 bg-slate-700/50 rounded-full h-2.5">
                <div
                    className="bg-teal-400 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="w-10 font-semibold">{percentage}%</span>
        </div>
    );
}
