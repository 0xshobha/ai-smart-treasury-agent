import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { RiskEngine, MarketData } from "./risk-engine";
import { MarketDataProvider } from "./market-data";
import { TreasuryWallet } from "./wallet";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class TreasuryAgent {
  private riskEngine = new RiskEngine();
  private dataProvider = new MarketDataProvider();
  private wallet = new TreasuryWallet();
  private mode: "Safe" | "Aggressive" = "Safe";

  async runCycle() {
    console.log("--- Starting Autonomous Treasury Cycle ---");
    
    // 1. Get Market Data
    const marketData = await this.dataProvider.getMarketData();
    const sentiment = await this.dataProvider.getLatestSentiment();
    
    console.log(`Current Sentiment: ${sentiment}`);
    
    // 2. Risk Assessment
    const baseRisk = this.riskEngine.calculateTreasuryRisk(marketData);
    const sentimentAdjustment = await this.riskEngine.analyzeSentiment(sentiment);
    const finalRiskScore = baseRisk + sentimentAdjustment;
    
    console.log(`Treasury Risk Score: ${finalRiskScore} (Mode: ${this.mode})`);

    // 3. AI Opinion (Using Gemini)
    const prompt = `Analyze this crypto market data and sentiment for a treasury agent:
    Data: ${JSON.stringify(marketData)}
    Sentiment: ${sentiment}
    Current Risk Score: ${finalRiskScore}
    Mode: ${this.mode}
    
    Recommendation: Should we REALLOCATE to safer assets (USDT/XAUT), STAY, or INVEST MORE? Give a brief reason.`;

    try {
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      console.log(`AI Analysis: ${aiResponse}`);

      // 4. Autonomous Decision
      const recommendation = this.riskEngine.getRecommendation(finalRiskScore, this.mode);
      console.log(`Decision Engine Recommendation: ${recommendation}`);

      if (recommendation === "REALLOCATE_TO_STABLE") {
        await this.executeRebalance("STABLE");
      } else if (recommendation === "INVEST_MORE") {
        await this.executeRebalance("YIELD");
      } else {
        console.log("Agent Action: Holding current positions.");
      }

    } catch (error) {
      console.error("AI Analysis failed, falling back to Risk Engine logic.", error);
    }
  }

  async executeRebalance(target: "STABLE" | "YIELD") {
    console.log(`Agent Action: Executing ${target} rebalance via Tether WDK...`);
    const balances = await this.wallet.getBalances();
    
    if (target === "STABLE") {
      // Rebalance ETH/Alt holdings to USDT/XAUT
      await this.wallet.rebalance("ETH", balances.ETH, "STABLE");
    } else {
      // Invest more into high yield stablepools
      await this.wallet.rebalance("USDT", 1000, "YIELD");
    }
  }

  setMode(mode: "Safe" | "Aggressive") {
    this.mode = mode;
  }
}

// Start the agent
const agent = new TreasuryAgent();
// Run every 10 seconds for demo purposes
setInterval(() => agent.runCycle(), 10000);
agent.runCycle();
