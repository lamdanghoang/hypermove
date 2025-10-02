"use client";

import { useState } from "react";
import { BTCFI_DATA, Protocol } from "@/data/btcfi-data";

export default function ProtocolsPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    const getProtocolsForFilter = () => {
        if (activeFilter === "native") {
            return BTCFI_DATA.native_btc;
        } else if (activeFilter === "wrapped") {
            return BTCFI_DATA.wrapped_btc;
        } else {
            return [...BTCFI_DATA.native_btc, ...BTCFI_DATA.wrapped_btc];
        }
    };

    const protocols = getProtocolsForFilter();

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    BTCFi Protocols
                </h1>
                <p className="text-slate-400">
                    Explore native Bitcoin and wrapped Bitcoin yield
                    opportunities
                </p>
            </header>

            <div className="flex justify-center mb-8">
                <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-lg">
                    <TabButton
                        label="All Protocols"
                        isActive={activeFilter === "all"}
                        onClick={() => handleFilterClick("all")}
                    />
                    <TabButton
                        label="Native BTC"
                        isActive={activeFilter === "native"}
                        onClick={() => handleFilterClick("native")}
                    />
                    <TabButton
                        label="Wrapped BTC"
                        isActive={activeFilter === "wrapped"}
                        onClick={() => handleFilterClick("wrapped")}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protocols.map((protocol) => (
                    <ProtocolCard key={protocol.protocol} protocol={protocol} />
                ))}
            </div>
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
        <button
            onClick={onClick}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? "bg-gradient text-gray-800"
                    : "text-slate-400 hover:bg-slate-700/50"
            }`}
        >
            {label}
        </button>
    );
}

function ProtocolCard({ protocol }: { protocol: Protocol }) {
    const isNative = BTCFI_DATA.native_btc.includes(protocol);

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                        <span className="text-2xl">{protocol.logo}</span>
                        <span>{protocol.protocol}</span>
                    </h3>
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isNative
                                ? "bg-orange-400/10 text-orange-400"
                                : "bg-sky-400/10 text-sky-400"
                        }`}
                    >
                        {isNative ? "Native BTC" : "Wrapped BTC"}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                        {protocol.current_apy}%
                    </div>
                    <div className="text-xs text-slate-400">APY</div>
                </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">
                {protocol.description}
            </p>

            <ul className="text-sm space-y-1 mb-4">
                {protocol.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between items-center text-sm">
                <div className="text-slate-400">
                    TVL:{" "}
                    <span className="font-semibold text-white">
                        {protocol.tvl}
                    </span>
                </div>
                <span
                    className={`font-semibold px-2 py-1 rounded-full text-xs ${
                        protocol.risk_level.toLowerCase().includes("low")
                            ? "bg-green-400/10 text-green-400"
                            : protocol.risk_level
                                  .toLowerCase()
                                  .includes("medium")
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-red-400/10 text-red-400"
                    }`}
                >
                    {protocol.risk_level}
                </span>
            </div>
        </div>
    );
}
