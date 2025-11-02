import { ChartData, Indicators } from '../types';

export function generateMockData(count: number): ChartData[] {
  const data: ChartData[] = [];
  let basePrice = 50000 + Math.random() * 10000;
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * 60000).toISOString();
    const change = (Math.random() - 0.5) * 500;
    basePrice += change;

    const open = basePrice;
    const close = basePrice + (Math.random() - 0.5) * 300;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    const volume = Math.random() * 1000000 + 500000;

    data.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });

    basePrice = close;
  }

  return data;
}

function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 0;
  const slice = data.slice(-period);
  return slice.reduce((sum, val) => sum + val, 0) / period;
}

function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 0;

  const k = 2 / (period + 1);
  let ema = calculateSMA(data.slice(0, period), period);

  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }

  return ema;
}

function calculateRSI(data: number[], period: number = 14): number {
  if (data.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateBollingerBands(
  data: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number; middle: number; lower: number } {
  const sma = calculateSMA(data, period);
  const slice = data.slice(-period);

  const variance =
    slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
  const std = Math.sqrt(variance);

  return {
    upper: sma + stdDev * std,
    middle: sma,
    lower: sma - stdDev * std,
  };
}

export function calculateIndicators(data: ChartData[]): Indicators {
  const closes = data.map((d) => d.close);
  const volumes = data.map((d) => d.volume);

  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macdLine = ema12 - ema26;

  const macdValues = [];
  for (let i = 26; i < closes.length; i++) {
    const e12 = calculateEMA(closes.slice(0, i + 1), 12);
    const e26 = calculateEMA(closes.slice(0, i + 1), 26);
    macdValues.push(e12 - e26);
  }

  const signalLine = calculateEMA(macdValues, 9);
  const histogram = macdLine - signalLine;

  const rsi = calculateRSI(closes);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const bollingerBands = calculateBollingerBands(closes);

  const recentPrices = closes.slice(-10);
  const volatility =
    Math.sqrt(
      recentPrices.reduce(
        (sum, price, i) =>
          i > 0 ? sum + Math.pow(price - recentPrices[i - 1], 2) : sum,
        0
      ) / (recentPrices.length - 1)
    ) / closes[closes.length - 1];

  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  const currentPrice = closes[closes.length - 1];
  if (currentPrice > sma20 && sma20 > sma50 && macdLine > 0) {
    trend = 'bullish';
  } else if (currentPrice < sma20 && sma20 < sma50 && macdLine < 0) {
    trend = 'bearish';
  }

  return {
    rsi,
    macd: {
      macd: macdLine,
      signal: signalLine,
      histogram,
    },
    sma20,
    sma50,
    ema12,
    ema26,
    bollingerBands,
    volume: volumes[volumes.length - 1],
    volatility: volatility * 100,
    trend,
  };
}
