import { MarketData } from './risk-engine';

export class MarketDataProvider {
  async getMarketData(): Promise<MarketData[]> {
    // In a real app, this would fetch from CoinGecko, Aave, etc.
    return [
      {
        symbol: 'USDT',
        price: 1.0,
        change24h: 0.01,
        apy: 5.2,
        riskScore: 5,
        gasFeeGwei: 20,
      },
      {
        symbol: 'XAUT',
        price: 2350.0,
        change24h: 1.2,
        apy: 0,
        riskScore: 10,
        gasFeeGwei: 20,
      },
      {
        symbol: 'ETH',
        price: 3500.0,
        change24h: -5.4,
        apy: 3.5,
        riskScore: 45,
        gasFeeGwei: 25,
      },
      {
        symbol: 'DAI',
        price: 1.0,
        change24h: -0.05,
        apy: 12.5, // High APY but maybe high risk?
        riskScore: 65,
        gasFeeGwei: 22,
      }
    ];
  }

  async getLatestSentiment(): Promise<string> {
    const sentiments = [
      "Market is seeing high volatility in ETH due to upcoming liquidations.",
      "Bullish sentiment on stablecoins as yields increase.",
      "Bearish trend in DeFi protocols following recent exploit reports."
    ];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }
}
