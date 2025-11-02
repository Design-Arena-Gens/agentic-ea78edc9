'use client';

import { useState, useEffect } from 'react';
import TradingChart from './components/TradingChart';
import TechnicalIndicators from './components/TechnicalIndicators';
import MarketData from './components/MarketData';
import { generateMockData, calculateIndicators } from './utils/chartData';
import { ChartData, Indicators } from './types';

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    const data = generateMockData(100);
    setChartData(data);
    setIndicators(calculateIndicators(data));

    const interval = setInterval(() => {
      const newData = generateMockData(100);
      setChartData(newData);
      setIndicators(calculateIndicators(newData));
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSymbol, timeframe]);

  const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'EUR/USD'];
  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Trading Chart Analyzer
          </h1>
          <p className="text-gray-400">Real-time market analysis with advanced technical indicators</p>
        </header>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex gap-2">
            <label className="text-sm text-gray-400 flex items-center">Symbol:</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <label className="text-sm text-gray-400 flex items-center">Timeframe:</label>
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <TradingChart data={chartData} symbol={selectedSymbol} />
            {indicators && <TechnicalIndicators indicators={indicators} />}
          </div>

          <div className="lg:col-span-1">
            <MarketData data={chartData} symbol={selectedSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
}
