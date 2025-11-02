'use client';

import { ChartData } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketDataProps {
  data: ChartData[];
  symbol: string;
}

export default function MarketData({ data, symbol }: MarketDataProps) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  const change = latest.close - previous.close;
  const changePercent = (change / previous.close) * 100;

  const high24h = Math.max(...data.slice(-24).map((d) => d.high));
  const low24h = Math.min(...data.slice(-24).map((d) => d.low));
  const volume24h = data.slice(-24).reduce((sum, d) => sum + d.volume, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 h-fit sticky top-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Market Data</h2>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Current Price</div>
          <div className="text-3xl font-bold">{formatCurrency(latest.close)}</div>
          <div
            className={`flex items-center gap-1 text-sm mt-1 ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {change >= 0 ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>
              {formatCurrency(Math.abs(change))} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">24h High</div>
              <div className="text-lg font-semibold text-green-400">
                {formatCurrency(high24h)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400">24h Low</div>
              <div className="text-lg font-semibold text-red-400">
                {formatCurrency(low24h)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400">24h Volume</div>
              <div className="text-lg font-semibold">{formatVolume(volume24h)}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 mb-2">OHLC</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Open:</span>
              <span className="font-semibold">{formatCurrency(latest.open)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">High:</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(latest.high)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Low:</span>
              <span className="font-semibold text-red-400">
                {formatCurrency(latest.low)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Close:</span>
              <span className="font-semibold">{formatCurrency(latest.close)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 mb-2">Price Range</div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full">
            <div
              className="absolute h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
              style={{
                width: '100%',
              }}
            ></div>
            <div
              className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-900 -top-0.5"
              style={{
                left: `${((latest.close - low24h) / (high24h - low24h)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatCurrency(low24h)}</span>
            <span>{formatCurrency(high24h)}</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded p-3 text-center">
            <div className="text-xs text-gray-200 mb-1">Market Status</div>
            <div className="text-sm font-bold">LIVE</div>
            <div className="text-xs text-gray-200 mt-1">
              Updates every 5 seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
