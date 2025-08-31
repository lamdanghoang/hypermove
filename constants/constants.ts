import { SelectOption } from "@/types/TradingInterface";

// Trading pairs and options
export const PRICE_STEP_OPTIONS: SelectOption[] = [
    { label: "0.000001", value: "0.000001" },
    { label: "0.000002", value: "0.000002" },
    { label: "0.000005", value: "0.000005" },
    { label: "0.00001", value: "0.00001" },
    { label: "0.0001", value: "0.0001" },
    { label: "0.001", value: "0.001" },
];

export const PAIR_OPTIONS: SelectOption[] = [
    { label: "BTC", value: "BTC" },
    { label: "USDT", value: "USDT" },
];

export const PRO_ORDER_OPTIONS: SelectOption[] = [
    { label: "Scale", value: "scale" },
    { label: "Stop Limit", value: "stop-limit" },
    { label: "Stop Market", value: "stop-market" },
    { label: "TWAP", value: "twap" },
];

// Mock data for development
export const MOCK_TICKERS = [
    { symbol: "AAVE-USD", change: "+0.19%" },
    { symbol: "ACE-USD", change: "+4.28%" },
    { symbol: "ADA-USD", change: "-0.28%" },
    { symbol: "ALGO-USD", change: "-1.23%" },
];

export const MOCK_MARKET_DATA = {
    mark: "0.078231",
    oracle: "0.077800",
    change24h: "+0.001470 / +1.92%",
    volume24h: "$4,777,133.67",
    openInterest: "$5,072,670.18",
    funding: "0.0013%",
    countdown: "00:59:53",
};

// UI Constants
export const GRID_LAYOUTS = {
    mobile: "flex flex-wrap",
    tablet: "md:grid md:grid-cols-1",
    desktop: "lg:grid-cols-[auto_320px]",
    xl: "xl:grid-cols-[auto_320px]",
} as const;

export const COMPONENT_HEIGHTS = {
    tradingInterface: "670px",
    positionsTable: "459px",
    accountOverview: "459px",
} as const;

// Trading constants
export const DEFAULT_TRADING_STATE = {
    selectedFavorite: "percent" as const,
    selectedPosition: "long" as const,
    selectedOption: null,
    selectedPriceStepOption: "0.000005",
};

export const ORDER_TYPES = {
    MARKET: "market",
    LIMIT: "limit",
    STOP_MARKET: "stop-market",
} as const;

// Table configurations
export const BALANCES_COLUMNS = [
    { key: "coin", label: "Coin", width: "12%" },
    { key: "totalBalance", label: "Total Balance", width: "14%" },
    { key: "availableBalance", label: "Available Balance", width: "14%" },
    { key: "usdcValue", label: "USDC Value", width: "12%", hasIcon: true },
    { key: "pnl", label: "PNL (ROE %)", width: "12%" },
    { key: "send", label: "Send", width: "10%" },
    { key: "transfer", label: "Transfer", width: "14%" },
    { key: "contract", label: "Contract", width: "12%" },
];

export const POSITIONS_COLUMNS = [
    { key: "coin", label: "Coin", width: "9%" },
    { key: "size", label: "Size", width: "9%" },
    {
        key: "positionValue",
        label: "Position Value",
        width: "9%",
        hasIcon: true,
    },
    { key: "entryPrice", label: "Entry Price", width: "9%" },
    { key: "markPrice", label: "Mark Price", width: "9%" },
    { key: "pnl", label: "PNL (ROE %)", width: "9%" },
    { key: "liqPrice", label: "Liq. Price", width: "9%" },
    { key: "margin", label: "Margin", width: "9%" },
    { key: "funding", label: "Funding", width: "7%" },
    { key: "closeAll", label: "Close All", width: "11%" },
    { key: "tpsl", label: "TP/SL", width: "9%" },
];

export const TABS_DATA = [
    { value: "balances", label: "Balances" },
    { value: "positions", label: "Positions" },
    { value: "open-orders", label: "Open Orders" },
    { value: "twap", label: "TWAP" },
    { value: "trade-history", label: "Trade History" },
    { value: "funding-history", label: "Funding History" },
    { value: "order-history", label: "Order History" },
];

// Account overview data
export const ACCOUNT_EQUITY_DATA = [
    { label: "Spot", value: "$0.00" },
    { label: "Perps", value: "$0.00" },
];

export const PERPS_OVERVIEW_DATA = [
    { label: "Balance", value: "$0.00" },
    { label: "Unrealized PNL", value: "$0.00" },
    { label: "Cross Margin Ratio", value: "0.00%" },
    { label: "Maintenance Margin", value: "$0.00" },
    { label: "Cross Account Leverage", value: "0.00x" },
];

// CSS Classes
export const COMMON_CLASSES = {
    gradientBg: "bg-gradient-to-br from-transparent via-white/10 to-white/5",
    gradientButton: "bg-gradient text-gray-800",
    hideScrollbar: "hide-scrollbar",
    textNowrap: "text-nowrap",
    roundedMd: "rounded-md",
} as const;
