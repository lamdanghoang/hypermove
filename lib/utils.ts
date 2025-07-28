import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining classes (similar to shadcn/ui)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format number with specified decimal places
export function formatNumber(
    value: number,
    decimals: number = 2,
    compact: boolean = false
): string {
    if (compact && Math.abs(value) >= 1000) {
        return new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: decimals,
        }).format(value);
    }

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

// Format currency values
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

// Format percentage values
export function formatPercentage(
    value: number,
    decimals: number = 2,
    showSign: boolean = true
): string {
    const formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        signDisplay: showSign ? "always" : "auto",
    }).format(value / 100);

    return formatted;
}

// Format time values
export function formatTime(timestamp: number): string {
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date(timestamp));
}

// Calculate price change
export function calculatePriceChange(
    currentPrice: number,
    previousPrice: number
): { absolute: number; percentage: number } {
    const absolute = currentPrice - previousPrice;
    const percentage = (absolute / previousPrice) * 100;

    return { absolute, percentage };
}

// Validate order input
export function validateOrderInput(
    size: number,
    price?: number,
    orderType: "market" | "limit" = "market"
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!size || size <= 0) {
        errors.push("Size must be greater than 0");
    }

    if (orderType === "limit" && (!price || price <= 0)) {
        errors.push("Price must be greater than 0 for limit orders");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
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

// Calculate margin required
export function calculateMarginRequired(
    size: number,
    price: number,
    leverage: number
): number {
    return (size * price) / leverage;
}

// Calculate fees
export function calculateFees(
    size: number,
    price: number,
    feeRate: number = 0.0004
): number {
    return size * price * feeRate;
}

// Debounce function
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

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Color helper for price changes
export function getPriceChangeColor(change: number): string {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
}

// Generate mock order book data
export function generateMockOrderBookData(
    basePrice: number = 0.078,
    levels: number = 20
) {
    const bids = [];
    const asks = [];

    for (let i = 0; i < levels; i++) {
        const bidPrice = basePrice - (i + 1) * 0.000001;
        const askPrice = basePrice + (i + 1) * 0.000001;
        const size = Math.floor(Math.random() * 50000) + 1000;

        bids.push({
            price: bidPrice,
            size,
            total: size * bidPrice,
        });

        asks.push({
            price: askPrice,
            size,
            total: size * askPrice,
        });
    }

    return { bids, asks, spread: 0.000002 };
}

// Generate mock trade data
export function generateMockTradeData(count: number = 50) {
    const trades = [];
    const basePrice = 0.078;

    for (let i = 0; i < count; i++) {
        const price = basePrice + (Math.random() - 0.5) * 0.001;
        const size = Math.floor(Math.random() * 100000) + 1000;
        const side = Math.random() > 0.5 ? "buy" : "sell";
        const time = Date.now() - i * 1000;

        trades.push({
            price,
            size,
            side,
            time: formatTime(time),
        });
    }

    return trades;
}

// Local storage helpers
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === "undefined") return defaultValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
        }
    },

    remove: (key: string): void => {
        if (typeof window === "undefined") return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    },
};

// API helpers (placeholder)
export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        // Placeholder for actual API calls
        throw new Error("API not implemented");
    },

    post: async <T>(endpoint: string, data: any): Promise<T> => {
        // Placeholder for actual API calls
        throw new Error("API not implemented");
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        // Placeholder for actual API calls
        throw new Error("API not implemented");
    },
};
