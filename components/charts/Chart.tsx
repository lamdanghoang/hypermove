"use client";

import {
    createChart,
    IChartApi,
    ISeriesApi,
    HistogramData,
    MouseEventParams,
    ChartOptions,
    DeepPartial,
    Time,
    SeriesMarkerPosition,
    SeriesMarkerShape,
    ColorType,
    AreaSeries,
    CandlestickSeries,
    HistogramSeries,
    UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useTradingData } from "@/services/TradingDataService";
import {
    subscribeBinanceKline,
    BinanceKline,
} from "@/services/BinanceWebSocketService";
import {
    BinanceKlineRest,
    fetchBinanceKlines,
} from "@/services/BinanceRestService";

const TOOLTIP_CONFIG = {
    HEIGHT: 22,
    PADDING: 8,
    COLORS: {
        PRIMARY: "#131722",
        TEXT: {
            LABEL: "#787B86",
            VALUE: "#D1D4DC",
            GREEN: "rgb(38, 166, 154)",
            RED: "rgb(239, 83, 80)",
            WHITE: "rgb(255, 255, 255)",
        },
        UP: "rgba(38, 166, 154, 0.3)",
        DOWN: "rgba(239, 83, 80, 0.3)",
        GREEN: "rgb(38, 166, 154)",
        RED: "rgb(239, 83, 80)",
    },
} as const;

// Types
interface ChartData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
    value?: number;
    color?: string;
}

interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

const formatNumber = (num: number): string => {
    return num.toFixed(7);
};

const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
        return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
};

const createTooltip = (): HTMLDivElement => {
    const tooltip = document.createElement("div");

    const baseStyles: Partial<CSSStyleDeclaration> = {
        height: `${TOOLTIP_CONFIG.HEIGHT}px`,
        position: "absolute",
        padding: `0 ${TOOLTIP_CONFIG.PADDING}px`,
        boxSizing: "border-box",
        fontSize: "12px",
        textAlign: "left",
        zIndex: "1000",
        top: "0",
        left: "0",
        right: "0",
        pointerEvents: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "transparent",
        color: TOOLTIP_CONFIG.COLORS.TEXT.VALUE,
        borderBottom: "1px solid rgba(42, 46, 57, 0.5)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    };

    Object.assign(tooltip.style, baseStyles);
    return tooltip;
};

const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
        textColor: "white",
        background: { color: "transparent" },
    },
    grid: {
        vertLines: {
            color: "rgba(197, 203, 206, 0.1)",
        },
        horzLines: {
            color: "rgba(197, 203, 206, 0.1)",
        },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
    rightPriceScale: {
        borderColor: "rgba(197, 203, 206, 0.1)",
    },
    crosshair: {
        mode: 1,
    },
};

export default function Chart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const symbolLabelRef = useRef<HTMLDivElement | null>(null);

    // Get real-time trading data
    const { marketData, recentTrades } = useTradingData();

    // Store historical candlestick data
    const [candlestickData, setCandlestickData] = useState<CandleData[]>([]);
    const [volumeData, setVolumeData] = useState<HistogramData[]>([]);
    const [lastTradeTime, setLastTradeTime] = useState<number>(0);

    useEffect(() => {
        async function loadHistory() {
            const history = await fetchBinanceKlines("BTCUSDT", "1m", 500);
            setCandlestickData(
                history.map((item: BinanceKlineRest) => ({
                    time: item.time as UTCTimestamp,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }))
            );
            setVolumeData(
                history.map((item: BinanceKlineRest) => ({
                    time: item.time as Time,
                    value: item.volume,
                    color:
                        item.close >= item.open
                            ? TOOLTIP_CONFIG.COLORS.UP
                            : TOOLTIP_CONFIG.COLORS.DOWN,
                }))
            );
        }
        loadHistory();
    }, []);

    useEffect(() => {
        if (candlestickData.length === 0) return;
        const ws = subscribeBinanceKline(
            "BTCUSDT",
            "1m",
            (kline: BinanceKline) => {
                setCandlestickData((prev) => {
                    const time = Math.floor(kline.t / 1000) as UTCTimestamp;
                    const candle = {
                        time,
                        open: parseFloat(kline.o),
                        high: parseFloat(kline.h),
                        low: parseFloat(kline.l),
                        close: parseFloat(kline.c),
                    };

                    if (
                        prev.length > 0 &&
                        prev[prev.length - 1].time === time
                    ) {
                        return [...prev.slice(0, -1), candle];
                    } else {
                        return [...prev, candle];
                    }
                });
                setVolumeData((prev) => {
                    const time = Math.floor(kline.t / 1000) as UTCTimestamp;
                    const volume = {
                        time,
                        value: parseFloat(kline.v),
                        color:
                            parseFloat(kline.c) >= parseFloat(kline.o)
                                ? TOOLTIP_CONFIG.COLORS.UP
                                : TOOLTIP_CONFIG.COLORS.DOWN,
                    };
                    if (
                        prev.length > 0 &&
                        prev[prev.length - 1].time === time
                    ) {
                        return [...prev.slice(0, -1), volume];
                    } else {
                        return [...prev, volume];
                    }
                });
            }
        );
        return () => {
            ws.close();
        };
    }, [candlestickData.length]);

    // Handle resize
    const handleResize = useCallback(() => {
        if (chartRef.current && chartContainerRef.current) {
            const newWidth = chartContainerRef.current.clientWidth;
            const newHeight = chartContainerRef.current.clientHeight;

            chartRef.current.resize(newWidth, newHeight);

            chartRef.current.timeScale().applyOptions({
                rightOffset: 12,
                barSpacing: 60,
            });
            chartRef.current.timeScale().fitContent();
        }
    }, []);

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        chartRef.current = createChart(chartContainerRef.current, chartOptions);

        // Add candlestick series
        candlestickSeriesRef.current = chartRef.current.addSeries(
            CandlestickSeries,
            {
                upColor: TOOLTIP_CONFIG.COLORS.GREEN,
                downColor: TOOLTIP_CONFIG.COLORS.RED,
                borderVisible: false,
                wickUpColor: TOOLTIP_CONFIG.COLORS.GREEN,
                wickDownColor: TOOLTIP_CONFIG.COLORS.RED,
                priceFormat: {
                    type: "price",
                    precision: 2,
                    minMove: 0.01,
                },
            }
        );

        candlestickSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.2,
            },
        });

        // Add volume series
        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
            color: TOOLTIP_CONFIG.COLORS.UP,
            priceFormat: {
                type: "volume",
            },
            priceScaleId: "",
        });

        volumeSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });

        // Generate and set initial data
        // XÓA/BỎ QUA các hàm generateInitialData, updateChartWithTrades và các useEffect liên quan đến dữ liệu giả lập

        chartRef.current.timeScale().fitContent();

        // Cleanup
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, []);

    // Giữ nguyên các useEffect render chart, setData cho candlestickSeriesRef và volumeSeriesRef
    useEffect(() => {
        if (candlestickSeriesRef.current && candlestickData.length > 0) {
            const sortedData = [...candlestickData]
                .sort((a, b) => Number(a.time) - Number(b.time))
                .filter(
                    (item, idx, arr) =>
                        idx === 0 || item.time !== arr[idx - 1].time
                );
            candlestickSeriesRef.current.setData(sortedData);
        }
        if (volumeSeriesRef.current && volumeData.length > 0) {
            const sortedVolume = [...volumeData]
                .sort((a, b) => Number(a.time) - Number(b.time))
                .filter(
                    (item, idx, arr) =>
                        idx === 0 || item.time !== arr[idx - 1].time
                );
            volumeSeriesRef.current.setData(sortedVolume);
        }
    }, [candlestickData, volumeData]);

    // Update chart with new trades
    useEffect(() => {
        // XÓA/BỎ QUA các hàm generateInitialData, updateChartWithTrades và các useEffect liên quan đến dữ liệu giả lập
    }, []);

    // Thêm useEffect sau khi đã có candlestickData và marketData
    useEffect(() => {
        // XÓA/BỎ QUA các hàm generateInitialData, updateChartWithTrades và các useEffect liên quan đến dữ liệu giả lập
    }, [marketData.markPrice]);

    // Handle resize
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        if (chartContainerRef.current) {
            resizeObserver.observe(chartContainerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [handleResize]);

    // Add window resize listener
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [handleResize]);

    return (
        <div className="w-full h-full p-1 rounded-md shadow-md">
            {/* <div className="p-2 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold">BTC-USD</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-mono">
                            ${marketData.markPrice.toFixed(6)}
                        </span>
                        <span
                            className={`text-sm px-2 py-1 rounded ${
                                marketData.priceChangePercent24h >= 0
                                    ? "text-green-400 bg-green-900/20"
                                    : "text-red-400 bg-red-900/20"
                            }`}
                        >
                            {marketData.priceChangePercent24h >= 0 ? "+" : ""}
                            {marketData.priceChangePercent24h.toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div className="text-xs text-gray-400">
                    Volume: ${formatVolume(marketData.volume24h)}
                </div>
            </div> */}
            <div
                ref={chartContainerRef}
                className="w-full h-full relative rounded-md"
            />
        </div>
    );
}
