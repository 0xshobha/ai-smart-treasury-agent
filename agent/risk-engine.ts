export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  apy: number;
  riskScore: number; // 0-100 (higher is riskier)
  gasFeeGwei: number;
}

export class RiskEngine {
  private safeThreshold = 30;
  private aggressiveThreshold = 70;

  calculateTreasuryRisk(data: MarketData[]): number {
    if (data.length === 0) return 0;
    const totalRisk = data.reduce((acc, curr) => acc + curr.riskScore, 0);
    return Math.round(totalRisk / data.length);
  }

  getRecommendation(riskScore: number, mode: 'Safe' | 'Aggressive'): 'REALLOCATE_TO_STABLE' | 'STAY' | 'INVEST_MORE' {
    if (mode === 'Safe') {
      if (riskScore > this.safeThreshold) return 'REALLOCATE_TO_STABLE';
      return 'STAY';
    } else {
      if (riskScore > this.aggressiveThreshold) return 'REALLOCATE_TO_STABLE';
      if (riskScore < 40) return 'INVEST_MORE';
      return 'STAY';
    }
  }

  async analyzeSentiment(sentimentText: string): Promise<number> {
    // Simple logic for now, could be enhanced with LLM
    if (sentimentText.toLowerCase().includes('bullish')) return -10;
    if (sentimentText.toLowerCase().includes('bearish')) return 20;
    return 0;
  }
}
