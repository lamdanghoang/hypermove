"use client";

import Header from "@/components/layout/Header";
import { AptosWalletProvider } from "../provider/AptosWalletProvider";
import { SuiWalletProvider } from "../provider/SuiWalletProvider";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AptosWalletProvider>
            <SuiWalletProvider>
                <div className="min-h-screen bg-background text-white">
                    <Header />
                    <main className="pt-15">{children}</main>
                </div>
            </SuiWalletProvider>
        </AptosWalletProvider>
    );
}
