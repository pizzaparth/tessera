import { ConceptNode, ConceptEdge } from '../types';

export const initialNodes: ConceptNode[] = [
  {
    id: 'fama_french_3f',
    label: 'Fama-French 3-Factor Model',
    type: 'model',
    domain: 'Factor Research',
    summary: 'Asset pricing model expanding CAPM by adding size risk and value risk factors to market risk.',
    definition: 'An empirical linear factor model specifying expected excess stock returns as a function of sensitivity to Market excess returns (Mkt-RF), Size factor (SMB), and Value factor (HML).',
    equations: [
      'R_{i,t} - R_{f,t} = \\alpha_i + \\beta_{i,1}(R_{m,t} - R_{f,t}) + \\beta_{i,2}\\text{SMB}_t + \\beta_{i,3}\\text{HML}_t + \\epsilon_{i,t}'
    ],
    assumptions: [
      'Unsystematic risk can be diversified away',
      'SMB and HML proxy for underlying pervasive macroeconomic distress risks',
      'Factor loadings remain relatively stable over estimation windows'
    ],
    markdownContent: `# Fama-French 3-Factor Model

## Overview
Proposed by Eugene Fama and Kenneth French in 1992-1993, the three-factor model addressed the empirical failure of the classic Capital Asset Pricing Model (CAPM) to explain cross-sectional equity returns.

## Mathematical Formulation
The expected excess return of asset $i$ is formulated as:
$$R_{i,t} - R_{f,t} = \\alpha_i + \\beta_{i,MKT}(R_{m,t} - R_{f,t}) + \\beta_{i,SMB}\\text{SMB}_t + \\beta_{i,HML}\\text{HML}_t + \\epsilon_{i,t}$$

Where:
- $R_{m,t} - R_{f,t}$ is the market risk premium.
- $\\text{SMB}_t$ (*Small Minus Big*) captures size premium.
- $\\text{HML}_t$ (*High Minus Low*) captures value premium (book-to-market equity ratio).
- $\\alpha_i$ represents abnormal return (zero under perfect factor pricing).

## Practical Relevance in Quant Trading
In modern quantitative portfolio construction, factor models are applied to:
1. **Risk decomposition**: Isolate idiosyncratic alpha from compensated beta risks.
2. **Performance attribution**: Attribute PnL to known style tilts vs manager skill.
3. **Factor neutralizing**: Construct long/short portfolios orthogonal to size and value.`,
    provenance: {
      source: 'Fama, E. F., & French, K. R. (1993). Common risk factors in the returns on stocks and bonds. Journal of Financial Economics, 33(1), 3-56.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T09:00:00Z',
    },
    versions: [
      {
        id: 'v1',
        timestamp: '2026-01-15T09:00:00Z',
        change: 'Initial node creation with standard formulation',
        author: 'Sample Library',
      },
    ],
  },
  {
    id: 'momentum_factor',
    label: 'Cross-Sectional Momentum',
    type: 'hypothesis',
    domain: 'Factor Research',
    summary: 'Tendency of past winning stocks over 3-12 months to continue outperforming past losers in the intermediate term.',
    definition: 'An empirical anomaly first systematically documented by Jegadeesh and Titman (1993), showing persistent excess returns to buying past top decile performers and shorting bottom decile performers.',
    equations: [
      '\\text{MOM}_t = \\frac{1}{N_W} \\sum_{i \\in \\text{Winners}} R_{i,t} - \\frac{1}{N_L} \\sum_{j \\in \\text{Losers}} R_{j,t}',
      '\\text{Signal}_{i,t} = \\prod_{k=2}^{12} (1 + R_{i,t-k}) - 1'
    ],
    assumptions: [
      'Investor under-reaction to new fundamental information (Hong & Stein)',
      'Disposition effect and performance benchmarking induce price drift',
      'Short-term reversal (1-month) must be skipped due to liquidity bounce'
    ],
    markdownContent: `# Cross-Sectional Momentum

## Overview
Cross-sectional momentum is one of the most robust and persistent market anomalies across asset classes and geographies. However, momentum is subject to occasional severe drawdowns known as **momentum crashes**, especially during market recoveries from panics.

## Signal Construction
A standard 12-2 momentum signal sorts securities based on cumulative return over months $t-12$ to $t-2$, explicitly skipping month $t-1$:
$$\\text{Signal}_{i,t} = \\prod_{k=2}^{12} (1 + R_{i,t-k}) - 1$$

Skipping the most recent month avoids the bid-ask bounce and short-term microstructure reversal.

## Carhart 4-Factor Extension
Mark Carhart (1997) officially extended Fama-French 3-factor by adding the WML (*Winners Minus Losers*) factor.`,
    provenance: {
      source: 'Jegadeesh, N., & Titman, S. (1993). Returns to Buying Winners and Selling Losers. Journal of Finance, 48(1), 65-91.',
      origin: 'sample_dataset',
      confidence: 0.98,
      createdAt: '2026-01-15T09:10:00Z',
    },
  },
  {
    id: 'carhart_4f',
    label: 'Carhart 4-Factor Model',
    type: 'model',
    domain: 'Factor Research',
    summary: 'Standard asset pricing benchmark augmenting Fama-French with a momentum factor (WML).',
    definition: 'An extension to the 3-factor model that accounts for the persistent momentum premium in mutual fund returns.',
    equations: [
      'R_{i,t} - R_{f,t} = \\alpha_i + \\beta_{i,1}\\text{MKT}_t + \\beta_{i,2}\\text{SMB}_t + \\beta_{i,3}\\text{HML}_t + \\beta_{i,4}\\text{WML}_t + \\epsilon_{i,t}'
    ],
    assumptions: [
      'Momentum is an independent systematic risk dimension not spanned by SMB and HML'
    ],
    markdownContent: `# Carhart 4-Factor Model

Developed by Mark Carhart in 1997 to evaluate equity mutual fund performance, proving that common persistence in fund alpha was largely explained by exposure to momentum.`,
    provenance: {
      source: 'Carhart, M. M. (1997). On Persistence in Mutual Fund Performance. Journal of Finance, 52(1), 57-82.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T09:15:00Z',
    },
  },
  {
    id: 'survivorship_bias',
    label: 'Survivorship Bias',
    type: 'hypothesis',
    domain: 'Factor Research',
    summary: 'Systematic error in backtesting when failed or delisted securities are excluded from historical datasets.',
    definition: 'A critical data pathology where a backtest only considers equities that currently exist, artificially boosting simulated performance of value and distressed factor strategies.',
    assumptions: [
      'Delisted firms experience extreme negative terminal returns upon liquidation',
      'Commercial equity databases without point-in-time delisting history yield invalid alpha'
    ],
    markdownContent: `# Survivorship Bias in Backtesting

## Impact on Factor Research
When backtesting quantitative strategies (especially high-book-to-market or small-cap strategies), failing companies routinely disappear from survivor-only datasets. The resulting backtest assumes the portfolio never experienced terminal losses, overstating Sharpe ratios by 0.5 to 1.5.

### Mitigation Strategies
- Use point-in-time database snapshots (e.g. CRSP with delisting return adjustments).
- Explicitly model delisting returns: $R_{\\text{delist}} = -30\\%$ to $-100\\%$.`,
    provenance: {
      source: 'Brown, S. J., Goetzmann, W., Ibbotson, R. G., & Ross, S. A. (1992). Survivorship Bias in Performance Studies. Review of Financial Studies, 5(4).',
      origin: 'sample_dataset',
      confidence: 0.99,
      createdAt: '2026-01-15T09:20:00Z',
    },
  },
  {
    id: 'crsp_compustat',
    label: 'CRSP / Compustat Merged',
    type: 'dataset',
    domain: 'Factor Research',
    summary: 'Gold-standard academic and institutional dataset offering point-in-time security pricing and fundamental accounting metrics.',
    definition: 'Comprehensive database combining Center for Research in Security Prices (CRSP) daily prices with S&P Compustat corporate balance sheet data with permanent identifiers (PERMNO / GVKEY).',
    assumptions: [
      'Accounting data must lag filing dates by at least 3 to 6 months to prevent lookahead bias'
    ],
    markdownContent: `# CRSP / Compustat Merged Database

The foundational benchmark for factor research in North American equities. Essential for avoiding both survivorship bias and lookahead bias.`,
    provenance: {
      source: 'Wharton Research Data Services (WRDS)',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T09:25:00Z',
    },
  },
  {
    id: 'mean_variance_opt',
    label: 'Markowitz Mean-Variance Optimization',
    type: 'method',
    domain: 'Portfolio Construction',
    summary: 'Mathematical framework for assembling a portfolio of assets to maximize expected return for a given risk level.',
    definition: 'Quadratic programming formulation selecting asset weights $w$ minimizing portfolio variance subject to target expected return.',
    equations: [
      '\\min_w \\frac{1}{2} w^T \\Sigma w \\quad \\text{subject to } w^T \\mathbf{1} = 1, \\; w^T \\mu = \\mu^*'
    ],
    assumptions: [
      'Asset returns are joint normally distributed or investors have quadratic utility',
      'Expected returns $\\mu$ and covariance matrix $\\Sigma$ are known constants (error maximization in practice)'
    ],
    markdownContent: `# Markowitz Mean-Variance Optimization

First proposed by Harry Markowitz in 1952. While theoretically elegant, direct sample estimation of $\\mu$ and $\\Sigma$ makes the optimizer an "error maximizer" due to estimation noise.`,
    provenance: {
      source: 'Markowitz, H. (1952). Portfolio Selection. The Journal of Finance, 7(1), 77-91.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T09:30:00Z',
    },
  },
  {
    id: 'black_litterman',
    label: 'Black-Litterman Model',
    type: 'model',
    domain: 'Portfolio Construction',
    summary: 'Bayesian portfolio allocation technique blending market equilibrium prior with investor subjective views.',
    definition: 'A Bayesian framework developed at Goldman Sachs that stabilizes unconstrained Markowitz optimization by using CAPM market-cap implied returns as a strong prior.',
    equations: [
      '\\Pi = \\lambda \\Sigma w_{mkt}',
      'E[R] = [(\\tau \\Sigma)^{-1} + P^T \\Omega^{-1} P]^{-1} [(\\tau \\Sigma)^{-1} \\Pi + P^T \\Omega^{-1} Q]'
    ],
    assumptions: [
      'Market capitalization weights reflect true underlying equilibrium',
      'Views are expressed linearly with Gaussian uncertainty matrix $\\Omega$'
    ],
    markdownContent: `# Black-Litterman Bayesian Portfolio Model

## Background
Fisher Black and Robert Litterman (1991, 1992) developed this framework to overcome the extreme instability of standard Markowitz mean-variance optimization.

## Key Mechanism
1. **Reverse Optimization**: Back out equilibrium excess returns $\\Pi$ from market weights:
   $$\\Pi = \\lambda \\Sigma w_{\\text{mkt}}$$
2. **Combine with Views**: Blend subjective alpha forecasts $Q$ with error covariance $\\Omega$ using Bayes' theorem.`,
    provenance: {
      source: 'Black, F., & Litterman, R. (1992). Global Portfolio Optimization. Financial Analysts Journal, 48(5), 28-43.',
      origin: 'sample_dataset',
      confidence: 0.99,
      createdAt: '2026-01-15T09:35:00Z',
    },
  },
  {
    id: 'volatility_targeting',
    label: 'Volatility Targeting',
    type: 'method',
    domain: 'Risk Management',
    summary: 'Dynamic leverage scaling adjusting exposure inversely to forecast volatility to stabilize portfolio risk.',
    definition: 'Risk management rule where total gross exposure $L_t = \\frac{\\sigma^*}{\\hat{\\sigma}_t}$, keeping portfolio volatility constant across market regimes.',
    equations: [
      'w_t = w_0 \\cdot \\min \\left( L_{\\max}, \\frac{\\sigma_{\\text{target}}}{\\hat{\\sigma}_t} \\right)'
    ],
    assumptions: [
      'Volatility clustering implies high past realized volatility predicts higher future short-term volatility',
      'De-leveraging during high volatility reduces sequence-of-returns drawdown risk'
    ],
    markdownContent: `# Volatility Targeting

## Principle
Assets exhibit volatility clustering: calm regimes are followed by calm regimes, and high-volatility regimes produce severe shocks. By scaling exposure inversely to trailing or GARCH volatility, the investor achieves:
- Reduced tail risks and smaller maximum drawdowns.
- Higher risk-adjusted returns (higher Sharpe and Sortino ratios).`,
    provenance: {
      source: 'Harvey, C. R., et al. (2018). Impact of Volatility Targeting. Journal of Portfolio Management, 45(1), 14-33.',
      origin: 'sample_dataset',
      confidence: 0.97,
      createdAt: '2026-01-15T09:40:00Z',
    },
  },
  {
    id: 'garch_11',
    label: 'GARCH(1,1) Model',
    type: 'model',
    domain: 'Time Series & Econometrics',
    summary: 'Generalized Autoregressive Conditional Heteroskedasticity model for predicting time-varying volatility.',
    definition: 'Time-series model modeling conditional variance as a weighted sum of long-run average variance, yesterday’s squared return innovation, and yesterday’s forecast variance.',
    equations: [
      '\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2 \\quad \\text{with } \\alpha + \\beta < 1'
    ],
    assumptions: [
      'Stationarity requires $\\alpha + \\beta < 1$',
      'Shocks have symmetric impact on volatility (unlike EGARCH / GJR-GARCH)'
    ],
    markdownContent: `# GARCH(1,1) Time Series Model

Introduced by Tim Bollerslev (1986) expanding Robert Engle's ARCH model (Nobel Memorial Prize 2003). Crucial for estimating volatility forecasts in volatility targeting and Value-at-Risk calculations.`,
    provenance: {
      source: 'Bollerslev, T. (1986). Generalized Autoregressive Conditional Heteroskedasticity. Journal of Econometrics, 31(3), 307-327.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T09:45:00Z',
    },
  },
  {
    id: 'kyles_lambda',
    label: "Kyle's Lambda (Market Impact)",
    type: 'metric',
    domain: 'Market Microstructure',
    summary: 'Measure of market illiquidity quantifying the price change caused by one unit of order flow.',
    definition: 'The slope coefficient $\\lambda$ from regressing price change $\\Delta P_t$ on signed order flow $Q_t$.',
    equations: [
      '\\Delta P_t = \\lambda Q_t + \\eta_t, \\quad \\lambda = \\frac{\\text{Cov}(\\Delta P_t, Q_t)}{\\text{Var}(Q_t)}'
    ],
    assumptions: [
      'Informed traders conceal orders among noise trader volume',
      'Market makers set prices to break even conditional on observed total flow'
    ],
    markdownContent: `# Kyle's Lambda (\\lambda)

## Definition
First formulated in Pete Kyle's seminal 1985 paper *Continuous Auctions and Informed Trader*. $\\lambda$ measures the cost of immediacy and market depth:
$$\\Delta P = \\lambda \\cdot Q$$

Higher $\\lambda$ signifies an illiquid market where large algorithmic orders experience substantial adverse price drift.`,
    provenance: {
      source: 'Kyle, A. S. (1985). Continuous Auctions and Informed Trader. Econometrica, 53(6), 1315-1335.',
      origin: 'sample_dataset',
      confidence: 0.99,
      createdAt: '2026-01-15T09:50:00Z',
    },
  },
  {
    id: 'order_book_imbalance',
    label: 'Limit Order Book Imbalance',
    type: 'metric',
    domain: 'Market Microstructure',
    summary: 'Ratio of bids to asks at top-of-book levels, predicting short-term tick price movement.',
    definition: 'Normalized volume asymmetry between best bid volume $V_b$ and best ask volume $V_a$.',
    equations: [
      '\\text{OFI} = \\frac{V_b - V_a}{V_b + V_a} \\in [-1, 1]'
    ],
    assumptions: [
      'Order cancellations and new limit arrivals convey real-time inventory and latency cues'
    ],
    markdownContent: `# Limit Order Book (LOB) Imbalance

An essential high-frequency and execution signal. When $\\text{OFI} > 0$, buy pressure dominates the near queue, predicting upward quote midpoint movement over sub-second to minute horizons.`,
    provenance: {
      source: 'Cont, R., Kukanov, A., & Stoikov, S. (2014). The Price Impact of Order Book Events. Journal of Financial Econometrics, 12(1), 47-88.',
      origin: 'sample_dataset',
      confidence: 0.96,
      createdAt: '2026-01-15T09:55:00Z',
    },
  },
  {
    id: 'almgren_chriss',
    label: 'Almgren-Chriss Optimal Execution',
    type: 'model',
    domain: 'Execution & Trading',
    summary: 'Framework determining the optimal liquidation schedule balancing market impact costs against volatility risk.',
    definition: 'Calculates the optimal trading trajectory $x_t$ minimizing expected implementation shortfall plus risk aversion penalty times variance of execution cost.',
    equations: [
      'U(x) = E[x] + \\lambda_{\\text{risk}} V[x]',
      'x_j = \\frac{\\sinh(\\kappa (T - t_j))}{\\sinh(\\kappa T)} X_0'
    ],
    assumptions: [
      'Permanent price impact is linear in traded volume',
      'Temporary impact is independent across trading periods',
      'Trader has constant absolute risk aversion (CARA)'
    ],
    markdownContent: `# Almgren-Chriss Optimal Execution Framework

## Core Problem
A quantitative fund executing a large order must choose between:
1. **Aggressive trading**: Rapid completion minimizes exposure to market volatility drift, but induces massive temporary market impact.
2. **Passive trading**: Slow trading minimizes price impact, but leaves the portfolio exposed to adverse price moves.

The Almgren-Chriss closed-form solution yields an exponential decay trading schedule based on asset volatility and liquidity.`,
    provenance: {
      source: 'Almgren, R., & Chriss, N. (2000). Optimal execution of portfolio transactions. Journal of Risk, 3(2), 5-40.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T10:00:00Z',
    },
  },
  {
    id: 'sharpe_ratio',
    label: 'Sharpe Ratio',
    type: 'metric',
    domain: 'Risk Management',
    summary: 'Foundational measure of risk-adjusted excess return per unit of total standard deviation.',
    definition: 'Ratio of expected excess portfolio return over risk-free rate to standard deviation of return.',
    equations: [
      '\\text{SR} = \\frac{E[R_p - R_f]}{\\sigma(R_p - R_f)}'
    ],
    assumptions: [
      'Returns are normally distributed',
      'Ignores higher moments like negative skewness and fat-tailed excess kurtosis'
    ],
    markdownContent: `# Sharpe Ratio

Developed by William Sharpe (1966, 1994). The primary metric for strategy evaluation, though vulnerable to distortion under autocorrelation, leverage spikes, and tail-risk harvesting.`,
    provenance: {
      source: 'Sharpe, W. F. (1994). The Sharpe Ratio. The Journal of Portfolio Management, 21(1), 49-58.',
      origin: 'sample_dataset',
      confidence: 1.0,
      createdAt: '2026-01-15T10:05:00Z',
    },
  },
  {
    id: 'value_at_risk',
    label: 'Value at Risk (VaR)',
    type: 'metric',
    domain: 'Risk Management',
    summary: 'Quantile threshold measuring the maximum expected monetary loss over a specified horizon at a given confidence level.',
    definition: 'For confidence level $\\alpha$ and horizon $T$, $\\text{VaR}_{\\alpha}$ is defined such that $P(L > \\text{VaR}_{\\alpha}) = 1 - \\alpha$.',
    equations: [
      '\\text{VaR}_{\\alpha} = - (\\mu_p + z_{\\alpha} \\sigma_p)'
    ],
    assumptions: [
      'Non-subadditive: does not satisfy coherent risk measure axioms (unlike Expected Shortfall / CVaR)'
    ],
    markdownContent: `# Value at Risk (VaR) & Expected Shortfall

Standard regulatory and risk-desk threshold metric. Often coupled with Historical Simulation and EVT (Extreme Value Theory).`,
    provenance: {
      source: 'J.P. Morgan RiskMetrics Group (1996). RiskMetrics Technical Document.',
      origin: 'sample_dataset',
      confidence: 0.98,
      createdAt: '2026-01-15T10:10:00Z',
    },
  },
  {
    id: 'factor_crowding_question',
    label: 'Does factor crowding accelerate crash risk?',
    type: 'research_question',
    domain: 'Factor Research',
    summary: 'Open inquiry into whether institutional capital concentration in momentum and low-vol factors drives fire-sale cascades.',
    definition: 'Hypothesis that when multiple systematic funds hold identical style factors, correlated liquidity withdrawals trigger systemic deleveraging spirals.',
    assumptions: [
      'Fund overlap can be estimated from 13F filings and pairwise return correlations',
      'Short-squeezes disproportionately affect the short leg of factor portfolios'
    ],
    markdownContent: `# Research Question: Factor Crowding & Deleveraging Spirals

## Motivation
The August 2007 "Quant Quake" and March 2020 factor rotations demonstrated that market-neutral statistical arbitrage and factor portfolios can experience sudden drawdowns unrelated to macroeconomic news.

## Open Investigations
1. How can factor crowding be measured real-time without delay?
2. Does volatility targeting exacerbate factor crashes by forcing concurrent systematic deleveraging?`,
    provenance: {
      source: 'Khandani, A. E., & Lo, A. W. (2011). What happened to the quants in August 2007? Journal of Investment Management, 9(4), 5-46.',
      origin: 'sample_dataset',
      confidence: 0.95,
      createdAt: '2026-01-15T10:15:00Z',
    },
  },
];

export const initialEdges: ConceptEdge[] = [
  {
    id: 'edge_carhart_ff',
    source: 'carhart_4f',
    target: 'fama_french_3f',
    type: 'extends',
    label: 'extends',
    description: 'Carhart 4-factor explicitly incorporates Fama-French 3-factor and adds momentum (WML).',
    provenance: {
      source: 'Carhart (1997)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:15:00Z',
    },
  },
  {
    id: 'edge_carhart_mom',
    source: 'carhart_4f',
    target: 'momentum_factor',
    type: 'depends_on',
    label: 'depends on',
    description: 'Requires cross-sectional momentum anomaly definitions to build the WML factor.',
    provenance: {
      source: 'Carhart (1997)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:15:00Z',
    },
  },
  {
    id: 'edge_survivorship_ff',
    source: 'survivorship_bias',
    target: 'fama_french_3f',
    type: 'challenges',
    label: 'challenges',
    description: 'Survivorship bias artificially inflates historical returns of value (HML) and size (SMB) factors.',
    provenance: {
      source: 'Brown et al. (1992)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:20:00Z',
    },
  },
  {
    id: 'edge_ff_crsp',
    source: 'fama_french_3f',
    target: 'crsp_compustat',
    type: 'uses_data_from',
    label: 'uses data from',
    description: 'Original and updated factor portfolios are derived directly from CRSP prices and Compustat book values.',
    provenance: {
      source: 'Fama & French (1993)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:25:00Z',
    },
  },
  {
    id: 'edge_bl_mvo',
    source: 'black_litterman',
    target: 'mean_variance_opt',
    type: 'extends',
    label: 'extends',
    description: 'Black-Litterman stabilizes Markowitz mean-variance optimization by conditioning expected returns on market equilibrium.',
    provenance: {
      source: 'Black & Litterman (1992)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:35:00Z',
    },
  },
  {
    id: 'edge_voltarg_garch',
    source: 'volatility_targeting',
    target: 'garch_11',
    type: 'depends_on',
    label: 'depends on',
    description: 'Volatility targeting relies on dynamic volatility estimates generated by models such as GARCH(1,1).',
    provenance: {
      source: 'Harvey et al. (2018)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:40:00Z',
    },
  },
  {
    id: 'edge_almgren_kyle',
    source: 'almgren_chriss',
    target: 'kyles_lambda',
    type: 'depends_on',
    label: 'depends on',
    description: 'Execution schedule cost functions model permanent market impact through linear Kyle-style lambda coefficients.',
    provenance: {
      source: 'Almgren & Chriss (2000)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T10:00:00Z',
    },
  },
  {
    id: 'edge_lobi_kyle',
    source: 'order_book_imbalance',
    target: 'kyles_lambda',
    type: 'related_to',
    label: 'related to',
    description: 'Book imbalance provides high-frequency microstructural insight into transient quote depth and lambda variations.',
    provenance: {
      source: 'Cont et al. (2014)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T09:55:00Z',
    },
  },
  {
    id: 'edge_sharpe_mvo',
    source: 'sharpe_ratio',
    target: 'mean_variance_opt',
    type: 'measures',
    label: 'measures',
    description: 'The tangency portfolio in Markowitz mean-variance optimization maximizes the expected Sharpe ratio.',
    provenance: {
      source: 'Sharpe (1994)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T10:05:00Z',
    },
  },
  {
    id: 'edge_var_voltarg',
    source: 'value_at_risk',
    target: 'volatility_targeting',
    type: 'measures',
    label: 'measures',
    description: 'Volatility targeting maintains a stable time-invariant Value at Risk profile.',
    provenance: {
      source: 'RiskMetrics',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T10:10:00Z',
    },
  },
  {
    id: 'edge_crowding_mom',
    source: 'factor_crowding_question',
    target: 'momentum_factor',
    type: 'challenges',
    label: 'challenges',
    description: 'Excessive capital allocation into momentum strategies heightens momentum crash frequency and severity.',
    provenance: {
      source: 'Khandani & Lo (2011)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T10:15:00Z',
    },
  },
  {
    id: 'edge_crowding_voltarg',
    source: 'factor_crowding_question',
    target: 'volatility_targeting',
    type: 'related_to',
    label: 'related to',
    description: 'Examines whether systemic de-leveraging from volatility targeting creates negative feedback loops in crowded assets.',
    provenance: {
      source: 'Khandani & Lo (2011)',
      origin: 'sample_dataset',
      createdAt: '2026-01-15T10:15:00Z',
    },
  },
];
