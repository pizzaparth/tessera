import { ExtractionResult } from '../types';

export interface SampleConversation {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
  extraction: ExtractionResult;
}

export const sampleConversations: SampleConversation[] = [
  {
    id: 'factor_momentum_debate',
    title: 'Cross-Sectional Momentum vs Short-Term Reversal',
    category: 'Factor Research & Execution',
    description: 'A discussion between two quant researchers on constructing robust 12-2 momentum signals, transaction costs, and avoiding liquidity squeeze.',
    text: `Researcher A: We observed that standard 12-1 momentum suffered major drawdown in the recent regime shift. Why aren't we lagging by one month to create a 12-2 signal?

Researcher B: Jegadeesh and Titman explicitly lagged the formation period by 1 month to avoid short-term reversal. At the 1-month horizon, returns are dominated by bid-ask bounce and market maker inventory adjustments, which induces mean reversion rather than momentum.

Researcher A: That makes sense. But what about execution drag? As soon as you rebalance monthly across 500 equities, Almgren-Chriss market impact eats 40% of the gross alpha. Also, if we don't control for factor crowding, we are sitting ducks for a momentum crash when the market rebounds.

Researcher B: Exactly. We should evaluate applying Volatility Targeting on the factor leg, or scaling weights inversely to Kyle's lambda. If we can estimate the order book imbalance real-time, we can schedule our VWAP/TWAP parent orders to execute when transient liquidity is highest.

Researcher A: Let's also check if survivorship bias in our CRSP universe is artificially flattering the loser leg. If bankrupted stocks aren't simulated with realistic delisting returns, the short side return will look artificially profitable.`,
    extraction: {
      summary: 'Discussion analyzing cross-sectional momentum signal degradation, the mechanics of 1-month short-term reversal, transaction costs under Almgren-Chriss execution, and risk mitigation via volatility targeting and survivorship bias controls.',
      claims: [
        'Short-term return at 1-month horizon exhibits mean reversion driven by market maker inventory and bid-ask bounce rather than trend continuation.',
        'Unmitigated monthly rebalancing in momentum strategies incurs market impact that erodes up to 40% of gross returns.',
        'Excluding delisting returns in historical data produces severe survivorship bias that overstates the profitability of short legs.'
      ],
      openQuestions: [
        'Can real-time limit order book imbalance indicators be used to dynamically time execution of factor rebalancing orders?',
        'Does volatility targeting successfully dampen momentum crashes without disproportionately truncating positive upside drift?'
      ],
      assumptions: [
        'Market makers adjust quotes symmetrically during liquidity shocks.',
        'Point-in-time pricing databases accurately capture the exact timing of corporate actions and bankruptcy filings.'
      ],
      concepts: [
        {
          id: 'short_term_reversal',
          label: 'Short-Term Reversal Anomaly',
          type: 'hypothesis',
          domain: 'Factor Research',
          summary: 'Tendency of equities with extreme positive/negative 1-month returns to reverse over the subsequent month due to liquidity imbalances.',
          confidence: 0.96,
          excerpt: 'At the 1-month horizon, returns are dominated by bid-ask bounce and market maker inventory adjustments, which induces mean reversion.',
          suggestedEdges: [
            {
              targetId: 'momentum_factor',
              type: 'challenges',
              label: 'challenges',
            },
            {
              targetId: 'kyles_lambda',
              type: 'related_to',
              label: 'related to',
            },
          ],
          status: 'pending',
        },
        {
          id: 'vwap_execution',
          label: 'VWAP / TWAP Execution Algorithm',
          type: 'method',
          domain: 'Execution & Trading',
          summary: 'Algorithmic benchmark order slicer allocating trades proportional to historical intraday volume curves to minimize market impact.',
          confidence: 0.94,
          excerpt: 'we can schedule our VWAP/TWAP parent orders to execute when transient liquidity is highest.',
          suggestedEdges: [
            {
              targetId: 'almgren_chriss',
              type: 'extends',
              label: 'extends',
            },
            {
              targetId: 'kyles_lambda',
              type: 'measures',
              label: 'measures',
            },
          ],
          status: 'pending',
        },
        {
          id: 'factor_crowding_metric',
          label: 'Pairwise Factor Crowding Index',
          type: 'metric',
          domain: 'Risk Management',
          summary: 'Empirical measure assessing institutional portfolio overlap and mutual fund concentration across active factor portfolios.',
          confidence: 0.92,
          excerpt: 'if we don\'t control for factor crowding, we are sitting ducks for a momentum crash when the market rebounds.',
          suggestedEdges: [
            {
              targetId: 'factor_crowding_question',
              type: 'measures',
              label: 'measures',
            },
            {
              targetId: 'volatility_targeting',
              type: 'related_to',
              label: 'related to',
            },
          ],
          status: 'pending',
        },
      ],
    },
  },
  {
    id: 'microstructure_lob_execution',
    title: 'High-Frequency Order Flow & Price Impact Dynamics',
    category: 'Market Microstructure & Execution',
    description: 'An analysis of limit order books, queuing theory, adverse selection, and optimal execution algorithms under tick constraints.',
    text: `Trader: When we send aggressive market orders in small-cap equities, our realized implementation shortfall is nearly double our pre-trade TCA model estimates.

Quant: That is because your model assumes linear price impact without accounting for adverse selection. When you cross the spread, you are trading against informed counterparties with sub-millisecond latency advantages. Kyle's lambda increases non-linearly when the order book depth is depleted.

Trader: What if we condition our order submission on the Order Flow Imbalance (OFI)? If OFI is positive and the bid queue is deep, can we use passive limit orders instead?

Quant: Yes. In Cont et al. (2014), OFI showed high explanatory power for near-term price changes. Furthermore, Almgren-Chriss framework can be modified to account for transient vs permanent impact. By allowing our execution trajectory to slow down when bid-ask spread widens, we reduce both market impact and execution risk.`,
    extraction: {
      summary: 'Analysis of transaction cost analysis (TCA) deficiencies, adverse selection in limit order books, and enhancing execution with order flow imbalance and non-linear market impact models.',
      claims: [
        'Linear price impact models systematically underestimate transaction costs for aggressive orders in low-liquidity environments.',
        'Order flow imbalance contains significant predictive power for price changes over high-frequency horizons.'
      ],
      openQuestions: [
        'How does queue position priority affect the fill rate of passive limit orders across different exchange matching engines?'
      ],
      assumptions: [
        'Cancellation rates of limit orders do not anticipate parent order arrivals.'
      ],
      concepts: [
        {
          id: 'adverse_selection',
          label: 'Adverse Selection in LOB',
          type: 'hypothesis',
          domain: 'Market Microstructure',
          summary: 'The risk that a market maker or passive liquidity provider trades with an informed party with superior directional foresight.',
          confidence: 0.97,
          excerpt: 'When you cross the spread, you are trading against informed counterparties with sub-millisecond latency advantages.',
          suggestedEdges: [
            {
              targetId: 'kyles_lambda',
              type: 'depends_on',
              label: 'depends on',
            },
            {
              targetId: 'order_book_imbalance',
              type: 'related_to',
              label: 'related to',
            },
          ],
          status: 'pending',
        },
        {
          id: 'tca_implementation_shortfall',
          label: 'Implementation Shortfall TCA',
          type: 'metric',
          domain: 'Execution & Trading',
          summary: 'Difference between the decision price when an investment idea is approved and the actual volume-weighted average execution price.',
          confidence: 0.95,
          excerpt: 'our realized implementation shortfall is nearly double our pre-trade TCA model estimates.',
          suggestedEdges: [
            {
              targetId: 'almgren_chriss',
              type: 'measures',
              label: 'measures',
            },
          ],
          status: 'pending',
        },
      ],
    },
  },
];
