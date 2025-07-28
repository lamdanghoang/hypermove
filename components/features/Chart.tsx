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
} from "lightweight-charts";
import React, { useEffect, useRef, useCallback } from "react";

const TOOLTIP_CONFIG = {
    HEIGHT: 22, // Reduced height for single line
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
    time: Time;
    open: number;
    high: number;
    low: number;
    close: number;
    value?: number;
    color?: string;
}

const generateData = (
    startDate: Date,
    count: number
): { candlestickData: ChartData[]; volumeData: HistogramData[] } => {
    const candlestickData: ChartData[] = [];
    const volumeData: HistogramData[] = [];
    let currentDate = new Date(startDate);
    let lastClose = 100;

    for (let i = 0; i < count; i++) {
        const time = currentDate.toISOString().split("T")[0];

        const open = lastClose + (Math.random() - 0.5) * 5;
        const high = open + Math.random() * 5;
        const low = open - Math.random() * 5;
        const close = low + Math.random() * (high - low);

        candlestickData.push({ time, open, high, low, close });

        const volume = Math.floor(Math.random() * 1000000) + 100000;
        const color =
            close > open
                ? TOOLTIP_CONFIG.COLORS.UP
                : TOOLTIP_CONFIG.COLORS.DOWN;
        volumeData.push({ time, value: volume, color });

        lastClose = close;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { candlestickData, volumeData };
};

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

// Generate initial data
const { candlestickData: candlestickSeriesData, volumeData: volumeSeriesData } =
    generateData(new Date(2023, 0, 1), 100);

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
};

export default function Chart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const symbolLabelRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize chart
        chartRef.current = createChart(chartContainerRef.current, chartOptions);

        candlestickSeriesRef.current = chartRef.current.addSeries(
            CandlestickSeries,
            {
                upColor: TOOLTIP_CONFIG.COLORS.GREEN,
                downColor: TOOLTIP_CONFIG.COLORS.RED,
                borderVisible: false,
                wickUpColor: TOOLTIP_CONFIG.COLORS.GREEN,
                wickDownColor: TOOLTIP_CONFIG.COLORS.RED,
            }
        );

        candlestickSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.2,
            },
        });

        candlestickSeriesRef.current.setData(candlestickSeriesData);

        // Setup volume series
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

        volumeSeriesRef.current.setData(volumeSeriesData);

        chartRef.current.timeScale().fitContent();

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [handleResize]);

    return (
        <div className="w-full h-full p-1 rounded-md shadow-md">
            <div
                ref={chartContainerRef}
                className="w-full h-full relative rounded-md"
            />
        </div>
    );
}
