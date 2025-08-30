"use client";

import { Button } from "@/components/ui/button";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Globe, Settings } from "lucide-react";
import Link from "next/link";
import { WalletSelector } from "../wallet/ConnectButton";

const navs = [
    { label: "Trade", url: "/trade" },
    { label: "Vaults", url: "/vaults" },
    { label: "Portfolio", url: "/portfolio" },
    { label: "Staking", url: "/staking" },
];

const Header = () => {
    const currentAccount = useCurrentAccount();

    return (
        <header className="fixed z-11 top-0 w-full min-h-14 px-4 py-3 bg-slate-800 box-border flex items-center justify-between">
            <div className="flex items-center gap-5.5">
                <h1 className="font-bold">HyperMove</h1>
                <div className="px-2.5 py-1.5 flex items-center gap-4.5">
                    {navs.map((nav, index) => (
                        <Link
                            key={index}
                            href={nav.url}
                            className="text-sm hover:text-zinc-400"
                        >
                            {nav.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2.5">
                <WalletSelector />

                <Button className="p-0 w-8 h-8 text-white bg-transparent hover:bg-gray-700 border-gray-600 border">
                    <Globe className="w-4 h-4" />
                </Button>
                <Button className="p-0 w-8 h-8 text-white bg-transparent hover:bg-gray-700 border-gray-600 border">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
