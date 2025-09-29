"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chain, ChainName, useChain } from "../context/ChainProvider";

export function ChainSelector() {
    const { chain, setChain } = useChain();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full md:w-40 flex items-center justify-between bg-accent text-accent-foreground"
                >
                    {ChainName[chain]}
                    <ChevronsUpDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onSelect={() => setChain(Chain.APTOS_MAINNET)}
                >
                    {ChainName[Chain.APTOS_MAINNET]}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => setChain(Chain.APTOS_TESTNET)}
                >
                    {ChainName[Chain.APTOS_TESTNET]}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setChain(Chain.SUI_MAINNET)}>
                    {ChainName[Chain.SUI_MAINNET]}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setChain(Chain.SUI_TESTNET)}>
                    {ChainName[Chain.SUI_TESTNET]}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
