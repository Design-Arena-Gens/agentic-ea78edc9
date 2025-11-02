'use client';

import { Indicators } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: Indicators;
}

export default function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-red-400' };
    if (rsi < 30) return { text: 'Oversold', color: 'text-green-400' };
    return { text: 'Neutral', color: 'text-yellow-400' };
  };

  const rsiStatus = getRSIStatus(indicators.rsi);

  const getTrendIcon = () => {
    if (indicators.trend === 'bullish')
      return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (indicators.trend === 'bearish')
      return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Technical Indicators</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">RSI (14)</div>
          <div className="text-2xl font-bold mb-1">{indicators.rsi.toFixed(2)}</div>
          <div className={`text-sm ${rsiStatus.color}`}>{rsiStatus.text}</div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">MACD</div>
          <div className="text-2xl font-bold mb-1">
            {indicators.macd.macd.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            Signal: {indicators.macd.signal.toFixed(2)}
          </div>
          <div
            className={`text-sm ${
              indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            Histogram: {indicators.macd.histogram.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Moving Averages</div>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-400">SMA 20:</span>{' '}
              <span className="font-semibold">${indicators.sma20.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">SMA 50:</span>{' '}
              <span className="font-semibold">${indicators.sma50.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">EMA 12:</span>{' '}
              <span className="font-semibold">${indicators.ema12.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Bollinger Bands</div>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-400">Upper:</span>{' '}
              <span className="font-semibold text-red-400">
                ${indicators.bollingerBands.upper.toFixed(2)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Middle:</span>{' '}
              <span className="font-semibold text-yellow-400">
                ${indicators.bollingerBands.middle.toFixed(2)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Lower:</span>{' '}
              <span className="font-semibold text-green-400">
                ${indicators.bollingerBands.lower.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Volatility</div>
          <div className="text-2xl font-bold mb-1">
            {indicators.volatility.toFixed(2)}%
          </div>
          <div
            className={`text-sm ${
              indicators.volatility > 2
                ? 'text-red-400'
                : indicators.volatility > 1
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}
          >
            {indicators.volatility > 2
              ? 'High'
              : indicators.volatility > 1
              ? 'Moderate'
              : 'Low'}
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Market Trend</div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <div className="text-2xl font-bold capitalize">{indicators.trend}</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Volume</div>
          <div className="text-xl font-bold">
            {(indicators.volume / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Signal Strength</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                indicators.trend === 'bullish'
                  ? 'bg-green-400'
                  : indicators.trend === 'bearish'
                  ? 'bg-red-400'
                  : 'bg-yellow-400'
              }`}
              style={{
                width: `${Math.abs(indicators.macd.histogram) * 2}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
