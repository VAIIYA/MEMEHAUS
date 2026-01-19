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
                textColor: '#9CA3AF',
            },
            grid: {
                vertLines: { color: 'rgba(75, 85, 99, 0.2)' },
                horzLines: { color: 'rgba(75, 85, 99, 0.2)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                borderColor: 'rgba(75, 85, 99, 0.5)',
                timeVisible: true,
                secondsVisible: false,
            },
        };

        const chart = createChart(chartContainerRef.current, chartOptions);
        chartRef.current = chart;

        const candlestickSeries = (chart as any).addCandlestickSeries({
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
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
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Price Chart</h2>
                <div className="flex space-x-2">
                    {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                        <button
                            key={tf}
                            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${tf === '1h' ? 'bg-neon-cyan text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
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
