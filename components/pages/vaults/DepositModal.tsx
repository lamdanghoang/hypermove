import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [btcAmount, setBtcAmount] = useState("0.00");
    const [aptosAmount, setAptosAmount] = useState("0.00");

    // Calculate proportions for the circle chart
    const btcValue = parseFloat(btcAmount) || 0;
    const aptosValue = parseFloat(aptosAmount) || 0;
    const total = btcValue + aptosValue;

    const btcPercentage = total > 0 ? (btcValue / total) * 100 : 50;
    const aptosPercentage = total > 0 ? (aptosValue / total) * 100 : 50;

    // Calculate stroke-dasharray for the circle segments
    const circumference = 2 * Math.PI * 45; // radius = 45
    const btcStrokeDash = (btcPercentage / 100) * circumference;
    const aptosStrokeDash = (aptosPercentage / 100) * circumference;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl">DEPOSIT</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">A</span>
                            </div>
                            <span className="text-white text-sm">Aptos</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Bitcoin Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-black text-xs">₿</span>
                            </div>
                            <span className="text-white">Bitcoin ▼</span>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-1 text-sm">
                            Connect Bitcoin
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <span className="text-gray-400 text-sm">$0.00</span>
                        <div className="relative">
                            <Input
                                value={btcAmount}
                                onChange={(e) => setBtcAmount(e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white text-2xl h-12"
                                placeholder="0.00"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-gray-600 text-gray-300"
                                >
                                    10%
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-gray-600 text-gray-300"
                                >
                                    50%
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-gray-600 text-gray-300"
                                >
                                    Max
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circular Chart */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                        <svg
                            className="w-32 h-32 transform -rotate-90"
                            viewBox="0 0 100 100"
                        >
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="rgb(75, 85, 99)"
                                strokeWidth="8"
                                fill="none"
                            />

                            {/* Bitcoin segment */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="rgb(249, 115, 22)"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${btcStrokeDash} ${circumference}`}
                                strokeDashoffset="0"
                                className="transition-all duration-300"
                            />

                            {/* Aptos segment */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="rgb(107, 114, 128)"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${aptosStrokeDash} ${circumference}`}
                                strokeDashoffset={`-${btcStrokeDash}`}
                                className="transition-all duration-300"
                            />
                        </svg>

                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-white text-lg font-medium">
                                    {total > 0 ? total.toFixed(2) : "0.00"}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">
                            Bitcoin {btcPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">
                            Aptos {aptosPercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Aptos Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">A</span>
                        </div>
                        <span className="text-white">Aptos</span>
                        <span className="text-gray-400 text-sm">aBTC</span>
                        <div className="flex items-center text-xs text-gray-400">
                            <span>0×6220...6d84</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                value={aptosAmount}
                                onChange={(e) => setAptosAmount(e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white text-2xl h-12"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                {/* Connect Wallet Button */}
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black h-12 mb-4">
                    PLEASE CONNECT YOUR WALLET
                </Button>

                {/* Fee Info */}
                <div className="text-center text-gray-400 text-sm">
                    Fee(0.2%): -- BTC
                </div>
            </div>
        </div>
    );
}
