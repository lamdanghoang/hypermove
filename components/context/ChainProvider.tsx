"use client";

import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

export enum Chain {
    APTOS_MAINNET = "APTOS_MAINNET",
    APTOS_TESTNET = "APTOS_TESTNET",
    SUI_MAINNET = "SUI_MAINNET",
    SUI_TESTNET = "SUI_TESTNET",
}

export const ChainName: Record<Chain, string> = {
    [Chain.APTOS_MAINNET]: "Aptos Mainnet",
    [Chain.APTOS_TESTNET]: "Aptos Testnet",
    [Chain.SUI_MAINNET]: "Sui Mainnet",
    [Chain.SUI_TESTNET]: "Sui Testnet",
};

interface IChainContext {
    chain: Chain;
    setChain: (chain: Chain) => void;
}

export const ChainContext = createContext<IChainContext>({
    chain: Chain.SUI_TESTNET,
    setChain: () => {},
});

export const ChainProvider = ({ children }: PropsWithChildren) => {
    const [chain, setChain] = useState<Chain>(Chain.SUI_TESTNET);

    const handleSetChain = useCallback((chain: Chain) => {
        setChain(chain);
    }, []);

    const value = useMemo(
        () => ({
            chain,
            setChain: handleSetChain,
        }),
        [chain, handleSetChain]
    );

    return (
        <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
    );
};

export const useChain = () => {
    const context = useContext(ChainContext);
    if (!context) {
        throw new Error("useChain must be used within a ChainProvider");
    }
    return context;
};