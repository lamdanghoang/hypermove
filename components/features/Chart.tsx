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

    // Generate initial historical data
    const generateInitialData = useCallback(() => {
        const data: CandleData[] = [];
        const volumes: HistogramData[] = [];
        const startDate = new Date();
        startDate.setHours(startDate.getHours() - 24); // 24 hours ago

        let currentPrice = marketData.markPrice;

        // Generate hourly candles for the last 24 hours
        for (let i = 0; i < 24; i++) {
            const time = Math.floor(
                (startDate.getTime() + i * 3600000) / 1000
            ) as UTCTimestamp;

            const open = currentPrice;
            const volatility = 0.02; // 2% volatility
            const high = open + Math.random() * volatility * open;
            const low = open - Math.random() * volatility * open;
            const close = low + Math.random() * (high - low);

            data.push({
                time,
                open,
                high,
                low,
                close,
            });

            const volume = Math.floor(Math.random() * 100000) + 50000;
            const color =
                close > open
                    ? TOOLTIP_CONFIG.COLORS.UP
                    : TOOLTIP_CONFIG.COLORS.DOWN;

            volumes.push({
                time,
                value: volume,
                color,
            });

            currentPrice = close;
        }

        setCandlestickData(data);
        setVolumeData(volumes);
    }, [marketData.markPrice]);

    // Update chart with new trade data
    const updateChartWithTrades = useCallback(() => {
        if (
            !candlestickSeriesRef.current ||
            !volumeSeriesRef.current ||
            recentTrades.length === 0
        ) {
            return;
        }

        const latestTrade = recentTrades[0];
        if (latestTrade.timestamp <= lastTradeTime) {
            return; // No new trades
        }

        setLastTradeTime(latestTrade.timestamp);

        // Get current time rounded to nearest minute for candle grouping
        // Đảm bảo candleTime là số nguyên UNIX timestamp (giây), làm tròn xuống phút
        const candleTime = (Math.floor(latestTrade.timestamp / 1000 / 60) *
            60) as UTCTimestamp;

        setCandlestickData((prevData) => {
            const newData = [...prevData];
            const lastCandle = newData[newData.length - 1];

            if (lastCandle && Number(lastCandle.time) === candleTime) {
                // Update existing candle
                const updatedCandle: CandleData = {
                    ...lastCandle,
                    high: Math.max(lastCandle.high, latestTrade.price),
                    low: Math.min(lastCandle.low, latestTrade.price),
                    close: latestTrade.price,
                };
                newData[newData.length - 1] = updatedCandle;
                candlestickSeriesRef.current?.update(updatedCandle);
            } else {
                // Create new candle
                const newCandle: CandleData = {
                    time: candleTime,
                    open: latestTrade.price,
                    high: latestTrade.price,
                    low: latestTrade.price,
                    close: latestTrade.price,
                };
                newData.push(newCandle);
                candlestickSeriesRef.current?.update(newCandle);
            }

            return newData;
        });

        // Update volume data
        setVolumeData((prevVolumes) => {
            const newVolumes = [...prevVolumes];
            const lastVolume = newVolumes[newVolumes.length - 1];

            if (lastVolume && Number(lastVolume.time) === candleTime) {
                // Update existing volume
                const updatedVolume: HistogramData = {
                    ...lastVolume,
                    value: (lastVolume.value as number) + latestTrade.size,
                    color:
                        latestTrade.side === "buy"
                            ? TOOLTIP_CONFIG.COLORS.UP
                            : TOOLTIP_CONFIG.COLORS.DOWN,
                };
                newVolumes[newVolumes.length - 1] = updatedVolume;
                volumeSeriesRef.current?.update(updatedVolume);
            } else {
                // Create new volume bar
                const newVolume: HistogramData = {
                    time: candleTime,
                    value: latestTrade.size,
                    color:
                        latestTrade.side === "buy"
                            ? TOOLTIP_CONFIG.COLORS.UP
                            : TOOLTIP_CONFIG.COLORS.DOWN,
                };
                newVolumes.push(newVolume);
                volumeSeriesRef.current?.update(newVolume);
            }

            return newVolumes;
        });
    }, [recentTrades, lastTradeTime]);

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
                    precision: 6,
                    minMove: 0.000001,
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
        generateInitialData();

        chartRef.current.timeScale().fitContent();

        // Cleanup
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [generateInitialData]);

    // Set initial data when it's ready
    useEffect(() => {
        if (candlestickSeriesRef.current && candlestickData.length > 0) {
            const sortedData = [...candlestickData].sort(
                (a, b) => Number(a.time) - Number(b.time)
            );
            candlestickSeriesRef.current.setData(sortedData);
        }
        if (volumeSeriesRef.current && volumeData.length > 0) {
            const sortedVolume = [...volumeData].sort(
                (a, b) => Number(a.time) - Number(b.time)
            );
            volumeSeriesRef.current.setData(sortedVolume);
        }
    }, [candlestickData, volumeData]);

    // Update chart with new trades
    useEffect(() => {
        updateChartWithTrades();
    }, [updateChartWithTrades]);

    // Thêm useEffect sau khi đã có candlestickData và marketData
    useEffect(() => {
        setCandlestickData((prevData) => {
            if (prevData.length === 0) return prevData;
            const newData = [...prevData];
            newData[newData.length - 1] = {
                ...newData[newData.length - 1],
                close: marketData.markPrice,
            };
            return newData;
        });
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
                    <h3 className="text-sm font-semibold">CHILLGUY-USD</h3>
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
