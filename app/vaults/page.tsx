"use client";

import DepositModal from "@/components/pages/vaults/DepositModal";
import VaultCard from "@/components/pages/vaults/VaultCard";
import { useState } from "react";

export default function VaultsInterface() {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const vaultData = [
        {
            projectName: "Aptos",
            projectLogo: "/chains/aptos.png",
            status: "4.6% APY",
            btcTypes: [
                { logo: "/chains/BTC.svg", symbol: "BTC" },
                { logo: "/chains/BTC.svg", symbol: "BTC" },
                { logo: "/chains/BTC.svg", symbol: "BTC" },
                { logo: "/chains/BTC.svg", symbol: "BTC" },
                { logo: "/chains/BTC.svg", symbol: "BTC" },
                { logo: "/chains/BTC.svg", symbol: "BTC" },
            ],
            availableAmount: 400.07,
            availableUnit: "aBTC",
            stakedAmount: 2341.92,
            stakedUnit: "aBTC",
            vaultCap: "$273,126,329",
            echoPointsMultiplier: 1,
            isLive: true,
        },
    ];

    const handleDepositClick = () => {
        setIsDepositModalOpen(true);
    };

    return (
        <div className="container mx-auto py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Vaults
                </h1>
                <div className="font-medium text-slate-400 text-center text-xs md:text-base">
                    <p> Stake BTC in selected Vaults and earn up to 30% APY.</p>
                    <p>Withdraw any time without penalties</p>
                </div>
            </header>

            {/* Vaults List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2">
                {vaultData.map((vault, index) => (
                    <div key={index}>
                        <VaultCard
                            {...vault}
                            onDepositClick={
                                index === 0 ? handleDepositClick : undefined
                            }
                        />
                    </div>
                ))}{" "}
            </div>
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />
        </div>
    );
}
