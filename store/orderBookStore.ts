import { Order, Trade } from "@/services/BinanceWebSocketService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderBookState {
    bids: Order[];
    asks: Order[];
    trades: Trade[];
    setBids: (b: Order[]) => void;
    setAsks: (a: Order[]) => void;
    setTrades: (t: Trade[]) => void;
    addTrade: (trade: Trade) => void;
}

export const useOrderBookStore = create<OrderBookState>()(
    persist(
        (set) => ({
            bids: [],
            asks: [],
            trades: [],
            setBids: (bids) => set({ bids }),
            setAsks: (asks) => set({ asks }),
            setTrades: (trades) => set({ trades }),
            addTrade: (trade: Trade) =>
                set((state) => {
                    const newTrades = [trade, ...state.trades].slice(0, 50);
                    return { trades: newTrades };
                }),
        }),
        {
            name: "order-book-store", // LocalStorage key
        }
    )
);
