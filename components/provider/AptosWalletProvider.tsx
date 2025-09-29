"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useChain, Chain } from "../context/ChainProvider";

export const AptosWalletProvider = ({ children }: PropsWithChildren) => {
    const { chain } = useChain();
    const network =
        chain === Chain.APTOS_MAINNET ? Network.MAINNET : Network.TESTNET;
    const isAptos =
        chain === Chain.APTOS_MAINNET || chain === Chain.APTOS_TESTNET;

    return (
        <AptosWalletAdapterProvider
            autoConnect={isAptos}
            dappConfig={{ network }}
            onError={(error) => {
                console.log("error", error);
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
};
