"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";

import { useState } from "react";

const navs = [
    { label: "Trade", url: "/trade" },
    { label: "Vaults", url: "/vaults" },
    // { label: "Dashboard", url: "/dashboard" },
    { label: "Router", url: "/router" },
    { label: "Protocols", url: "/protocols" },
    { label: "Portfolio", url: "/portfolio" },
    // { label: "Settings", url: "/settings" },
];

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="fixed z-50 top-0 w-full min-h-14 px-4 py-3 bg-slate-800 box-border flex items-center justify-between">
                {/* Left side - Logo and Desktop Navigation */}
                <div className="flex items-center gap-5.5">
                    <h1 className="font-bold text-white">HyperMove</h1>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden md:block px-2.5 py-1.5">
                        <div className="flex items-center gap-4.5">
                            {navs.map((nav, index) => (
                                <Link
                                    key={index}
                                    href={nav.url}
                                    className="text-sm text-white hover:text-zinc-400 transition-colors"
                                >
                                    {nav.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Right side - Desktop Actions and Mobile Menu Button */}
                <div className="flex items-center gap-2.5">
                    {/* Desktop Actions - Hidden on small screens */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        <ConnectWallet />
                    </div>

                    {/* Mobile Menu Button - Visible only on small screens */}
                    <Button
                        className="sm:hidden p-0 w-8 h-8 text-white bg-transparent hover:bg-gray-700 border-gray-600 border"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Menu className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 sm:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={toggleMobileMenu}
                    />

                    {/* Mobile Menu Content */}
                    <div className="fixed top-14 left-0 right-0 bg-slate-800 border-t border-gray-700 p-4">
                        {/* Mobile Navigation */}
                        <nav className="mb-6">
                            <div className="flex flex-col gap-4">
                                {navs.map((nav, index) => (
                                    <Link
                                        key={index}
                                        href={nav.url}
                                        className="text-white hover:text-zinc-400 transition-colors py-2 text-lg"
                                        onClick={toggleMobileMenu}
                                    >
                                        {nav.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        {/* Mobile Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <ConnectWallet />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
