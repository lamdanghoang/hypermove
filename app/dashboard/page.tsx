"use client";

import AllocationChart from "@/components/charts/AllocationChart";
import OverviewCard from "@/components/pages/dashboard/OverviewCard";
import { BTCFI_DATA } from "@/data/btcfi-data";

export default function DashboardPage() {
    const { user_portfolio, native_btc, wrapped_btc } = BTCFI_DATA;
    const topProtocols = [...native_btc, ...wrapped_btc]
        .sort((a, b) => b.current_apy - a.current_apy)
        .slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Portfolio Dashboard
                </h1>
                <p className="text-slate-400">
                    Your BTCFi yield optimization center
                </p>
            </header>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <OverviewCard
                    title="Total Portfolio"
                    value={`₿${user_portfolio.total_btc}`}
                    subValue={`$${user_portfolio.total_usd.toLocaleString()}`}
                />
                <OverviewCard
                    title="Current APY"
                    value={`${user_portfolio.current_apy}%`}
                    subValue={`$${(
                        user_portfolio.total_usd *
                        (user_portfolio.current_apy / 100)
                    ).toLocaleString()} annually`}
                    isSuccess
                />
                <OverviewCard
                    title="Monthly Yield"
                    value={`$${(
                        (user_portfolio.total_usd *
                            (user_portfolio.current_apy / 100)) /
                        12
                    ).toLocaleString()}`}
                    subValue="Last rebalance: 2 days ago"
                />
                <OverviewCard
                    title="Active Routes"
                    value="3"
                    subValue="Native & Wrapped"
                />
            </div>

            {/* Quick Route Optimizer */}
            <div className="mb-8">
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            🚀 Quick Route Optimizer
                        </h3>
                        <p className="text-slate-400">
                            Find the best allocation for your Bitcoin
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="form-group">
                                <label className="form-label">BTC Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    defaultValue="1.0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Risk Preference
                                </label>
                                <select className="form-control">
                                    <option value="conservative">
                                        Conservative (5-7% APY)
                                    </option>
                                    <option value="balanced" selected>
                                        Balanced (6-9% APY)
                                    </option>
                                    <option value="aggressive">
                                        Aggressive (8-15% APY)
                                    </option>
                                </select>
                            </div>
                            <button className="btn btn-primary">
                                Find Best Routes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Portfolio Allocation
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="h-[300px]">
                            <AllocationChart />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">Top Protocols</h3>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-slate-400 uppercase">
                                        <th className="pb-3">Protocol</th>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">APY</th>
                                        <th className="pb-3">TVL</th>
                                        <th className="pb-3">Risk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProtocols.map((protocol) => (
                                        <tr
                                            key={protocol.protocol}
                                            className="border-b border-slate-800"
                                        >
                                            <td className="py-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">
                                                        {protocol.logo}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {protocol.protocol}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        protocol.type.includes(
                                                            "Native"
                                                        )
                                                            ? "bg-orange-400/10 text-orange-400"
                                                            : "bg-sky-400/10 text-sky-400"
                                                    }`}
                                                >
                                                    {protocol.type.includes(
                                                        "Native"
                                                    )
                                                        ? "Native"
                                                        : "Wrapped"}
                                                </span>
                                            </td>
                                            <td className="text-green-400 font-semibold">
                                                {protocol.current_apy}%
                                            </td>
                                            <td>{protocol.tvl}</td>
                                            <td>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        protocol.risk_level
                                                            .toLowerCase()
                                                            .includes("low")
                                                            ? "bg-green-400/10 text-green-400"
                                                            : protocol.risk_level
                                                                  .toLowerCase()
                                                                  .includes(
                                                                      "medium"
                                                                  )
                                                            ? "bg-yellow-400/10 text-yellow-400"
                                                            : "bg-red-400/10 text-red-400"
                                                    }`}
                                                >
                                                    {protocol.risk_level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
