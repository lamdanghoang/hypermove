import { useState, useCallback, useMemo, useEffect } from "react";
import {
    TradingState,
    OrderFormData,
    PositionType,
    OrderOption,
    TradingModalState,
} from "@/types/TradingInterface";

// Hook for managing trading state
export function useTradingState() {
    const [tradingState, setTradingState] = useState<TradingState>({
        selectedFavorite: "percent",
        selectedPosition: "long",
        selectedOption: null,
        selectedPriceStepOption: "0.001",
        sizePercentage: 0,
        modalState: {
            marginMode: "cross",
            leverage: 1,
            showMarginModal: false,
            showLeverageModal: false,
            showInfoModal: false,
        },
    });

    const updateTradingState = useCallback((updates: Partial<TradingState>) => {
        setTradingState((prev) => ({ ...prev, ...updates }));
    }, []);

    const updateModalState = useCallback(
        (updates: Partial<TradingModalState>) => {
            setTradingState((prev) => ({
                ...prev,
                modalState: { ...prev.modalState, ...updates },
            }));
        },
        []
    );

    const handleFavoriteChange = useCallback(
        (favorite: TradingState["selectedFavorite"]) => {
            updateTradingState({ selectedFavorite: favorite });
        },
        [updateTradingState]
    );

    const handlePositionChange = useCallback(
        (position: PositionType) => {
            updateTradingState({ selectedPosition: position });
        },
        [updateTradingState]
    );

    const handleOptionChange = useCallback(
        (option: OrderOption) => {
            const newOption =
                tradingState.selectedOption === option ? null : option;
            updateTradingState({ selectedOption: newOption });
        },
        [tradingState.selectedOption, updateTradingState]
    );

    return {
        tradingState,
        updateTradingState,
        updateModalState,
        handleFavoriteChange,
        handlePositionChange,
        handleOptionChange,
    };
}

// Hook for managing order form data
export function useOrderForm() {
    const [formData, setFormData] = useState<OrderFormData>({
        orderType: "market",
        side: "long",
        size: 0,
        reduceOnly: false,
    });

    const updateFormData = useCallback((updates: Partial<OrderFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            orderType: "market",
            side: "long",
            size: 0,
            reduceOnly: false,
        });
    }, []);

    // Validation logic
    const isValidOrder = useMemo(() => {
        if (formData.size <= 0) return false;
        if (
            formData.orderType === "limit" &&
            (!formData.price || formData.price <= 0)
        )
            return false;
        return true;
    }, [formData]);

    return {
        formData,
        updateFormData,
        resetForm,
        isValidOrder,
    };
}

// Hook for managing WebSocket connections (placeholder)
export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState(null);

    // This would contain actual WebSocket logic
    // For now, it's just a placeholder structure

    return {
        isConnected,
        data,
        connect: () => setIsConnected(true),
        disconnect: () => setIsConnected(false),
    };
}

// Hook for local storage persistence
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window !== "undefined") {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            }
            return initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);

                if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                        key,
                        JSON.stringify(valueToStore)
                    );
                }
            } catch (error) {
                console.error(
                    `Error setting localStorage key "${key}":`,
                    error
                );
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue] as const;
}

// Hook for debouncing values (useful for API calls)
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
