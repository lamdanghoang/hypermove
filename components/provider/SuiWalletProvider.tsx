"use client";

import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { customTheme } from "../wallet/sui/customTheme";
import { PropsWithChildren } from "react";
import { useChain, Chain } from "../context/ChainProvider";

const queryClient = new QueryClient();

const networks = {
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
};

export const SuiWalletProvider = ({ children }: PropsWithChildren) => {
    const { chain } = useChain();
    const network = chain === Chain.SUI_MAINNET ? "mainnet" : "testnet";
    const isSui = chain === Chain.SUI_MAINNET || chain === Chain.SUI_TESTNET;

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork={network}>
                <WalletProvider autoConnect={isSui} theme={customTheme}>
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};
