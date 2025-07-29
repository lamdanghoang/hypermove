"use client";

import { TradingHeader } from "@/components/pages/trade/TradingHeader";
import { MarketInfo } from "@/components/pages/trade/MarketInfo";
import { TradingChart } from "@/components/pages/trade/TradingChart";
import { OrderBook } from "@/components/pages/trade/OrderBook";
import { TradingPanel } from "@/components/pages/trade/TradingPanel";
import { AccountOverview } from "@/components/pages/trade/AccountOverview";
import { PositionsTable } from "@/components/pages/trade/PositionsTable";
import { useTradingState } from "@/hooks/useTradingHooks";
import { GRID_LAYOUTS, COMPONENT_HEIGHTS } from "@/constants/constants";
import { cn } from "@/lib/utils";

export default function TradingInterface() {
    const {
        tradingState,
        updateTradingState,
        updateModalState,
        handleFavoriteChange,
        handlePositionChange,
        handleOptionChange,
    } = useTradingState();

    return (
        <div className="max-w-[100vw] min-h-screen bg-gray-900 text-white">
            <div
                className={cn(
                    "grid gap-1 max-w-full mx-auto p-1",
                    GRID_LAYOUTS.mobile,
                    GRID_LAYOUTS.tablet,
                    GRID_LAYOUTS.desktop,
                    GRID_LAYOUTS.xl
                )}
            >
                {/* Left Column - Chart and Market Info */}
                <div
                    className="space-y-1"
                    style={{ height: COMPONENT_HEIGHTS.tradingInterface }}
                >
                    <TradingHeader
                        selectedFavorite={tradingState.selectedFavorite}
                        onFavoriteChange={handleFavoriteChange}
                    />
                    <MarketInfo />
                    <TradingChart />
                </div>

                {/* Middle Column - Order Book */}
                <OrderBook
                    selectedPriceStepOption={
                        tradingState.selectedPriceStepOption
                    }
                />

                {/* Right Column - Trading Panel */}
                <TradingPanel
                    tradingState={tradingState}
                    onStateChange={updateTradingState}
                    onOptionChange={handleOptionChange}
                    onModalStateChange={updateModalState}
                />

                {/* Bottom Row - Positions and Account */}
                <PositionsTable />
                <AccountOverview />
            </div>
        </div>
    );
}
