// Core trading types
export type FavoriteType = "dollar" | "percent";
export type PositionType = "long" | "short";
export type OrderOption = "reduce-only" | "take-profit-stop-loss" | null;
export type OrderType = "market" | "limit" | "stop-market";

// Trading state interface
export interface TradingState {
    selectedFavorite: FavoriteType;
    selectedPosition: PositionType;
    selectedOption: OrderOption;
    sizePercentage: number;
    selectedPriceStepOption: string;
    modalState: TradingModalState;
}

export interface TradingModalState {
    marginMode: "cross" | "isolated";
    leverage: number;
    showMarginModal: boolean;
    showLeverageModal: boolean;
    showInfoModal: boolean;
}

// Market data interfaces
export interface TickerData {
    symbol: string;
    change: string;
    changePercent?: number;
}

export interface MarketData {
    mark: string;
    oracle: string;
    change24h: string;
    volume24h: string;
    openInterest: string;
    funding: string;
    countdown: string;
}

// Order book interfaces
export interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
}

export interface OrderBookData {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    spread: number;
}

// Trade interfaces
export interface TradeData {
    price: number;
    size: number;
    time: string;
    side: "buy" | "sell";
}

// Account interfaces
export interface Balance {
    coin: string;
    totalBalance: number;
    availableBalance: number;
    usdcValue: number;
    pnl: number;
    pnlPercent: number;
}

export interface Position {
    coin: string;
    size: number;
    positionValue: number;
    entryPrice: number;
    markPrice: number;
    pnl: number;
    pnlPercent: number;
    liquidationPrice: number;
    margin: number;
    funding: number;
}

// Form data interfaces
export interface OrderFormData {
    orderType: OrderType;
    side: PositionType;
    size: number;
    price?: number;
    reduceOnly: boolean;
    takeProfitPrice?: number;
    stopLossPrice?: number;
    takeProfitPercent?: number;
    stopLossPercent?: number;
}

// Component prop interfaces
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface SelectOption {
    label: string;
    value: string;
}
