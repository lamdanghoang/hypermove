"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Chain, ChainName, useChain } from "@/components/context/ChainProvider";
import { WalletSelector as SuiWalletSelector } from "@/components/wallet/sui/ConnectButton";
import {
    AptosWalletList,
    WalletSelector as AptosWalletSelector,
} from "@/components/wallet/aptos/WalletConnect";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useCurrentAccount as useSuiAccount } from "@mysten/dapp-kit";
import { ArrowLeft, Wallet } from "lucide-react";
import { ChainSelector } from "./ChainSelector";
import { SuiWalletList } from "../wallet/sui/SuiWalletList";

export function ConnectWallet() {
    const { chain, setChain } = useChain();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"chain" | "aptos" | "sui">("chain");

    const aptosWallet = useAptosWallet();
    const suiAccount = useSuiAccount();

    const isAptosChain =
        chain === Chain.APTOS_MAINNET || chain === Chain.APTOS_TESTNET;
    const isSuiChain =
        chain === Chain.SUI_MAINNET || chain === Chain.SUI_TESTNET;

    const isConnected =
        (isAptosChain && aptosWallet.connected) || (isSuiChain && !!suiAccount);

    const handleChainSelect = (selectedChain: Chain) => {
        setChain(selectedChain);
        if (
            selectedChain === Chain.APTOS_MAINNET ||
            selectedChain === Chain.APTOS_TESTNET
        ) {
            setStep("aptos");
        } else {
            setStep("sui");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset step after a delay to prevent content flash on close
        setTimeout(() => setStep("chain"), 150);
    };

    const handleBack = () => {
        setStep("chain");
    };

    const titles = {
        chain: "Select a Chain",
        aptos: "Connect Aptos Wallet",
        sui: "Connect Sui Wallet",
    };

    if (isConnected) {
        return (
            <div className="flex items-center gap-2.5">
                <ChainSelector />
                {isAptosChain && <AptosWalletSelector />}
                {isSuiChain && <SuiWalletSelector />}
            </div>
        );
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose();
                    } else {
                        setIsOpen(true);
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button className="min-w-40 bg-gradient hover:bg-primary/90 text-gray-800">
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 text-gray-50 border-gray-500">
                    <DialogHeader className="flex-row items-center">
                        {step !== "chain" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBack}
                                className="mr-2 shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <DialogTitle>{titles[step]}</DialogTitle>
                    </DialogHeader>

                    {step === "chain" && (
                        <div className="flex flex-col gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleChainSelect(Chain.APTOS_MAINNET)
                                }
                                className="text-gray-800 bg-white"
                            >
                                {ChainName[Chain.APTOS_MAINNET]}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleChainSelect(Chain.APTOS_TESTNET)
                                }
                                className="text-gray-800 bg-white"
                            >
                                {ChainName[Chain.APTOS_TESTNET]}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleChainSelect(Chain.SUI_MAINNET)
                                }
                                className="text-gray-800 bg-white"
                            >
                                {ChainName[Chain.SUI_MAINNET]}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleChainSelect(Chain.SUI_TESTNET)
                                }
                                className="text-gray-800 bg-white"
                            >
                                {ChainName[Chain.SUI_TESTNET]}
                            </Button>
                        </div>
                    )}

                    {step === "aptos" && (
                        <AptosWalletList onConnect={handleClose} />
                    )}

                    {step === "sui" && (
                        <SuiWalletList onConnect={handleClose} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
