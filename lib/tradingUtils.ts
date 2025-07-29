/**
 * Utility functions for trading platform
 */

// Format price with appropriate decimal places
export function formatPrice(price: number, decimals: number = 6): string {
    return price.toFixed(decimals);
}

// Format large numbers with K/M suffix
export function formatVolume(volume: number): string {
    if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
        return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toLocaleString();
}

// Format timestamp to HH:MM:SS
export function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

// Format countdown timer
export function formatCountdown(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Get color class for price changes
export function getPriceChangeColor(change: number): string {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
}

// Get color class for buy/sell sides
export function getPriceColor(side: "buy" | "sell"): string {
    return side === "buy" ? "text-green-400" : "text-red-400";
}

// Format percentage with + or - sign
export function formatPercentage(value: number, decimals: number = 2): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(decimals)}%`;
}

// Calculate liquidation price
export function calculateLiquidationPrice(
    entryPrice: number,
    leverage: number,
    side: "long" | "short",
    maintenanceMarginRate: number = 0.005
): number {
    if (side === "long") {
        return entryPrice * (1 - 1 / leverage + maintenanceMarginRate);
    } else {
        return entryPrice * (1 + 1 / leverage - maintenanceMarginRate);
    }
}

// Calculate PnL
export function calculatePnL(
    entryPrice: number,
    currentPrice: number,
    size: number,
    side: "long" | "short"
): { pnl: number; percentage: number } {
    let pnl: number;

    if (side === "long") {
        pnl = (currentPrice - entryPrice) * size;
    } else {
        pnl = (entryPrice - currentPrice) * size;
    }

    const percentage = (pnl / (entryPrice * size)) * 100;

    return { pnl, percentage };
}

// Generate realistic price movement
export function generatePriceMovement(currentPrice: number): number {
    // More realistic price movement with momentum
    const volatility = 0.0002; // 0.02% volatility
    const randomFactor = (Math.random() - 0.5) * 2;
    const momentum = Math.sin(Date.now() / 10000) * 0.3; // Slight trend

    return currentPrice * (1 + (randomFactor + momentum) * volatility);
}

// Validate trading input
export function validateOrder(order: {
    size: number;
    price?: number;
    type: "market" | "limit";
    balance: number;
}): { isValid: boolean; error?: string } {
    if (order.size <= 0) {
        return { isValid: false, error: "Size must be greater than 0" };
    }

    if (order.type === "limit" && (!order.price || order.price <= 0)) {
        return {
            isValid: false,
            error: "Price must be greater than 0 for limit orders",
        };
    }

    const requiredBalance = order.size * (order.price || 1);
    if (requiredBalance > order.balance) {
        return { isValid: false, error: "Insufficient balance" };
    }

    return { isValid: true };
}

// Debounce function for input handling
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Generate mock ticker data
export function generateMockTickers(count: number = 20) {
    const symbols = [
        "BTC-USD",
        "ETH-USD",
        "SOL-USD",
        "AVAX-USD",
        "MATIC-USD",
        "ATOM-USD",
        "DOT-USD",
        "LINK-USD",
        "UNI-USD",
        "AAVE-USD",
        "COMP-USD",
        "MKR-USD",
        "SNX-USD",
        "CRV-USD",
        "YFI-USD",
        "SUSHI-USD",
        "1INCH-USD",
        "BAL-USD",
        "REN-USD",
        "KNC-USD",
    ];

    return symbols.slice(0, count).map((symbol) => ({
        symbol,
        change: formatPercentage((Math.random() - 0.5) * 10),
        price: (Math.random() * 1000 + 10).toFixed(2),
        volume24h: Math.random() * 10000000 + 100000,
    }));
}

// Format currency
export function formatCurrency(
    value: number,
    currency: string = "USD",
    decimals: number = 2
): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

// Get order book level color intensity based on size
export function getOrderBookLevelIntensity(
    size: number,
    maxSize: number
): number {
    return Math.min(size / maxSize, 1) * 0.3; // Max 30% opacity
}

// Calculate average price from order book levels
export function calculateAveragePrice(levels: any[], depth: number): number {
    const relevantLevels = levels.slice(0, depth);
    const totalValue = relevantLevels.reduce(
        (sum, level) => sum + level.price * level.size,
        0
    );
    const totalSize = relevantLevels.reduce(
        (sum, level) => sum + level.size,
        0
    );

    return totalSize > 0 ? totalValue / totalSize : 0;
}

// Generate trade ID
export function generateTradeId(): string {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check if price is valid
export function isValidPrice(price: any): boolean {
    return typeof price === "number" && price > 0 && isFinite(price);
}

// Check if size is valid
export function isValidSize(size: any): boolean {
    return typeof size === "number" && size > 0 && isFinite(size);
}

// Generate order book data with realistic distribution
export function generateOrderBookData(
    basePrice: number,
    levels: number = 20,
    spread: number = 0.0001
) {
    const bids = [];
    const asks = [];

    // Generate bids (below base price)
    for (let i = 0; i < levels; i++) {
        const price = basePrice - spread / 2 - i * spread * 0.1;
        const size =
            Math.floor(Math.random() * 50000 + 5000) *
            (1 + Math.random() * 0.5);

        bids.push({
            price: price,
            size: size,
            total: size,
            count: Math.floor(Math.random() * 10) + 1,
        });
    }

    // Generate asks (above base price)
    for (let i = 0; i < levels; i++) {
        const price = basePrice + spread / 2 + i * spread * 0.1;
        const size =
            Math.floor(Math.random() * 50000 + 5000) *
            (1 + Math.random() * 0.5);

        asks.push({
            price: price,
            size: size,
            total: size,
            count: Math.floor(Math.random() * 10) + 1,
        });
    }

    // Calculate cumulative totals
    let bidTotal = 0;
    let askTotal = 0;

    bids.forEach((bid) => {
        bidTotal += bid.size;
        bid.total = bidTotal;
    });

    asks.forEach((ask) => {
        askTotal += ask.size;
        ask.total = askTotal;
    });

    return {
        bids,
        asks,
        spread: asks[0].price - bids[0].price,
    };
}

// Local storage helpers with error handling
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === "undefined") return defaultValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Failed to get ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to set ${key} in localStorage:`, error);
        }
    },

    remove: (key: string): void => {
        if (typeof window === "undefined") return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Failed to remove ${key} from localStorage:`, error);
        }
    },
};

// Performance monitoring utilities
export const performance = {
    mark: (name: string): void => {
        if (typeof window !== "undefined" && window.performance) {
            window.performance.mark(name);
        }
    },

    measure: (name: string, startMark: string, endMark: string): void => {
        if (typeof window !== "undefined" && window.performance) {
            try {
                window.performance.measure(name, startMark, endMark);
            } catch (error) {
                console.warn(`Failed to measure ${name}:`, error);
            }
        }
    },
};

// WebSocket connection helper
export function createWebSocketConnection(
    url: string,
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
): WebSocket | null {
    if (typeof window === "undefined") return null;

    try {
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.warn("Failed to parse WebSocket message:", error);
            }
        };

        ws.onerror =
            onError ||
            ((error) => {
                console.warn("WebSocket error:", error);
            });

        ws.onclose =
            onClose ||
            ((event) => {
                console.log(
                    "WebSocket connection closed:",
                    event.code,
                    event.reason
                );
            });

        return ws;
    } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        return null;
    }
}
