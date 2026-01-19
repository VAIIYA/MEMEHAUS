'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface TokenChartProps {
    mintAddress: string;
    initialData?: CandlestickData[];
}

export const TokenChart: React.FC<TokenChartProps> = ({ mintAddress, initialData = [] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions = {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#6A737D',
                fontFamily: 'Euclid Circular B, sans-serif',
            },
            grid: {
                vertLines: { color: '#F2F4F6' },
                horzLines: { color: '#F2F4F6' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                borderColor: '#E5E7EB',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#E5E7EB',
            },
        };

        const chart = createChart(chartContainerRef.current, chartOptions);
        chartRef.current = chart;

        const candlestickSeries = (chart as any).addCandlestickSeries({
            upColor: '#037DD6',
            downColor: '#D73A49',
            borderVisible: false,
            wickUpColor: '#037DD6',
            wickDownColor: '#D73A49',
        });
        candlestickSeriesRef.current = candlestickSeries;

        // Use provided data or generate some mock data if empty
        let chartData = initialData;
        if (chartData.length === 0) {
            // Mock data for initial view
            const now = Math.floor(Date.now() / 1000);
            chartData = Array.from({ length: 50 }).map((_, i) => {
                const time = (now - (50 - i) * 3600) as any;
                const open = 0.0001 + Math.random() * 0.0001;
                const close = open + (Math.random() - 0.5) * 0.00005;
                return {
                    time,
                    open,
                    high: Math.max(open, close) + Math.random() * 0.00002,
                    low: Math.min(open, close) - Math.random() * 0.00002,
                    close,
                };
            });
        }

        candlestickSeries.setData(chartData);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [initialData]);

    return (
        <div className="bg-white rounded-2xl border border-metamask-gray-100 p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-metamask-heading font-black text-metamask-purple">Price Performance</h2>
                <div className="flex space-x-1 bg-metamask-gray-50 p-1 rounded-full border border-metamask-gray-100">
                    {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                        <button
                            key={tf}
                            className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${tf === '1h'
                                ? 'bg-metamask-purple text-white shadow-sm'
                                : 'text-gray-400 hover:text-metamask-purple hover:bg-white'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartContainerRef} className="w-full h-[300px]" />
        </div>
    );
};
