"use client";

import { Button } from "@/components/ui/button";
import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import Image from "next/image";

interface SuiWalletListProps {
    onConnect: () => void;
}

export function SuiWalletList({ onConnect }: SuiWalletListProps) {
    const wallets = useWallets();
    const { mutate: connect } = useConnectWallet({
        onSuccess: () => {
            onConnect();
        },
    });

    return (
        <div className="flex flex-col gap-3 pt-3">
            {wallets.map((wallet) => (
                <Button
                    key={wallet.name}
                    onClick={() => connect({ wallet })}
                    variant="outline"
                    className="w-full flex justify-start items-center gap-4 px-4 py-6 bg-white hover:bg-slate-50 text-gray-900"
                >
                    <Image
                        src={wallet.icon}
                        alt={wallet.name}
                        width={24}
                        height={24}
                    />
                    <span>{wallet.name}</span>
                </Button>
            ))}
            {wallets.length === 0 && (
                <p className="text-center text-gray-500">
                    No wallets found. Please install a Sui wallet extension.
                </p>
            )}
        </div>
    );
}
