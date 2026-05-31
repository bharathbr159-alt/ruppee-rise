// ── RUPEE RISE MARKET DATA ──
// Add this script to index.html before </body>
// Creates a live ticker bar + market cards

const MARKET_CONFIG = {
    // Yahoo Finance proxy (free, no key needed)
    yahooBase: 'https://query1.finance.yahoo.com/v8/finance/chart/',
    // Gold API (free)
    goldAPI: 'https://api.metals.live/v1/spot/gold',
};

// Symbols to fetch
const SYMBOLS = [
    { id: '^NSEI',   label: 'Nifty 50',  type: 'index' },
    { id: '^BSESN',  label: 'Sensex',    type: 'index' },
    { id: 'GOLDBEES.NS', label: 'Gold ETF', type: 'etf' },
    { id: 'RELIANCE.NS', label: 'Reliance', type: 'stock' },
    { id: 'TCS.NS',      label: 'TCS',      type: 'stock' },
    { id: 'HDFCBANK.NS', label: 'HDFC Bank', type: 'stock' },
    { id: 'INFY.NS',     label: 'Infosys',   type: 'stock' },
];

// FD Rates (hardcoded - updated quarterly)
const FD_RATES = [
    { bank: 'SBI',         rate: 7.10, tenure: '1-2 years' },
    { bank: 'HDFC Bank',   rate: 7.40, tenure: '1-2 years' },
    { bank: 'ICICI Bank',  rate: 7.25, tenure: '1-2 years' },
    { bank: 'Axis Bank',   rate: 7.20, tenure: '1-2 years' },
    { bank: 'Kotak Bank',  rate: 7.40, tenure: '1-2 years' },
    { bank: 'PNB',         rate: 7.05, tenure: '1-2 years' },
];

// ── INJECT STYLES ──
const marketStyles = document.createElement('style');
marketStyles.textContent = `
  /* TICKER BAR */
  .ticker-bar {
    background: #0d1f0d;
    border-bottom: 1px solid rgba(0,200,150,0.2);
    padding: 0;
    overflow: hidden;
    height: 36px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 60px;
    left: 0; right: 0;
    z-index: 99;
  }
  .ticker-label {
    background: #00C896;
    color: #0a0f0a;
    font-size: 11px;
    font-weight: 700;
    padding: 0 14px;
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.05em;
  }
  .ticker-scroll {
    display: flex;
    animation: ticker-move 30s linear infinite;
    white-space: nowrap;
  }
  .ticker-scroll:hover { animation-play-state: paused; }
  @keyframes ticker-move {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .ticker-item .t-name { color: #8aaa90; }
  .ticker-item .t-price { color: #e8f5e8; font-weight: 600; }
  .ticker-item .t-change { font-size: 11px; }
  .ticker-item .t-change.up   { color: #00C896; }
  .ticker-item .t-change.down { color: #FF6B6B; }

  /* MARKET SECTION */
  .market-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    padding-top: 1rem;
  }
  .market-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .market-title h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 1.8rem;
    color: #e8f5e8;
  }
  .market-title span {
    font-size: 11px;
    color: #6b8f6b;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .live-dot {
    width: 7px; height: 7px;
    background: #00C896;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* INDEX CARDS */
  .index-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  .index-card {
    background: #111811;
    border: 1px solid rgba(0,200,150,0.15);
    border-radius: 14px;
    padding: 16px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .index-card:hover { border-color: #00C896; transform: translateY(-2px); }
  .index-card .ic-label { font-size: 11px; color: #6b8f6b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .index-card .ic-price { font-size: 22px; font-weight: 700; color: #e8f5e8; font-family: 'JetBrains Mono', monospace; }
  .index-card .ic-change { font-size: 12px; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
  .index-card .ic-change.up   { color: #00C896; }
  .index-card .ic-change.down { color: #FF6B6B; }
  .index-card .ic-sub { font-size: 10px; color: #6b8f6b; margin-top: 4px; }
  .skeleton { background: linear-gradient(90deg, #1a221a 25%, #243024 50%, #1a221a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; height: 22px; width: 80%; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* MARKET GRID */
  .market-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 1.5rem;
  }
  .market-card {
    background: #111811;
    border: 1px solid rgba(0,200,150,0.15);
    border-radius: 16px;
    padding: 20px;
  }
  .market-card h3 { font-size: 13px; color: #6b8f6b; margin-bottom: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

  /* STOCK TABLE */
  .stock-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
  }
  .stock-row:last-child { border-bottom: none; }
  .stock-name { color: #e8f5e8; font-weight: 500; }
  .stock-price { font-family: 'JetBrains Mono', monospace; color: #e8f5e8; }
  .stock-change { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
  .stock-change.up   { color: #00C896; }
  .stock-change.down { color: #FF6B6B; }

  /* FD TABLE */
  .fd-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
  }
  .fd-row:last-child { border-bottom: none; }
  .fd-bank { color: #e8f5e8; font-weight: 500; }
  .fd-rate { font-family: 'JetBrains Mono', monospace; color: #00C896; font-weight: 700; font-size: 14px; }
  .fd-tenure { font-size: 11px; color: #6b8f6b; }

  /* GOLD CARD */
  .gold-card {
    background: linear-gradient(135deg, #1a1500, #201a00);
    border: 1px solid rgba(255,209,102,0.2);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .gold-left { display: flex; align-items: center; gap: 14px; }
  .gold-icon { font-size: 32px; }
  .gold-info .label { font-size: 11px; color: #8a7a00; text-transform: uppercase; letter-spacing: 0.05em; }
  .gold-info .price { font-size: 28px; font-weight: 700; color: #FFD166; font-family: 'JetBrains Mono', monospace; }
  .gold-info .sub { font-size: 11px; color: #8a7a00; margin-top: 2px; }
  .gold-change { font-size: 14px; font-family: 'JetBrains Mono', monospace; }
  .gold-change.up   { color: #00C896; }
  .gold-change.down { color: #FF6B6B; }

  @media (max-width: 900px) {
    .index-grid { grid-template-columns: 1fr 1fr; }
    .market-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .index-grid { grid-template-columns: 1fr 1fr; }
  }
`;
document.head.appendChild(marketStyles);

// ── FETCH MARKET DATA ──
async function fetchQuote(symbol) {
    try {
        const res = await fetch(
            `https://ruppee-rise.onrender.com/api/market/${symbol}`,
            { headers: { 'Accept': 'application/json' } }
        );
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) return null;
        return {
            price: meta.regularMarketPrice,
            prev:  meta.chartPreviousClose || meta.previousClose,
            change: meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose),
            changePct: ((meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose)) / (meta.chartPreviousClose || meta.previousClose)) * 100,
        };
    } catch { return null; }
}
async function fetchGoldPrice() {
    try {
        // Gold in USD per troy oz → convert to INR per gram
        const res = await fetch('https://api.metals.live/v1/spot/gold');
        const data = await res.json();
        const usdPerOz = data?.[0]?.gold || 2300;
        // Approx USD to INR (hardcoded, close enough for display)
        const inrPerGram = (usdPerOz * 83.5) / 31.1035;
        return { price: Math.round(inrPerGram), change: 0, changePct: 0 };
    } catch {
        return { price: 7200, change: 45, changePct: 0.63 }; // fallback
    }
}

function fmtPrice(n) {
    if (!n) return '—';
    if (n >= 100000) return '₹' + (n/100000).toFixed(2) + 'L';
    if (n >= 1000)   return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    return '₹' + n.toFixed(2);
}

function fmtChange(change, pct) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${pct.toFixed(2)}%)`;
}

// ── BUILD TICKER ──
function buildTicker(marketData) {
    // Remove old ticker if exists
    const old = document.getElementById('rr-ticker');
    if (old) old.remove();

    const ticker = document.createElement('div');
    ticker.className = 'ticker-bar';
    ticker.id = 'rr-ticker';

    let items = '';
    marketData.forEach(d => {
        if (!d.data) return;
        const cls = d.data.change >= 0 ? 'up' : 'down';
        const arrow = d.data.change >= 0 ? '▲' : '▼';
        items += `
          <div class="ticker-item">
            <span class="t-name">${d.label}</span>
            <span class="t-price">${fmtPrice(d.data.price)}</span>
            <span class="t-change ${cls}">${arrow} ${Math.abs(d.data.changePct).toFixed(2)}%</span>
          </div>`;
    });

    ticker.innerHTML = `
     
      <div style="overflow:hidden; flex:1;">
        <div class="ticker-scroll">${items}${items}</div>
      </div>`;

    // Insert after nav
    const nav = document.querySelector('nav');
    if (nav) nav.after(ticker);

    // Push page content down
    document.querySelectorAll('.page').forEach(p => p.style.paddingTop = '96px');
}

// ── BUILD MARKET SECTION ──
function buildMarketSection(marketData, goldData) {
    const nifty  = marketData.find(d => d.id === '^NSEI');
    const sensex = marketData.find(d => d.id === '^BSESN');
    const stocks = marketData.filter(d => d.type === 'stock');

    // Find or create market section in home page
    const homePage = document.getElementById('page-home');
    if (!homePage) return;

    let marketSection = document.getElementById('rr-market-section');
    if (!marketSection) {
        marketSection = document.createElement('div');
        marketSection.id = 'rr-market-section';
        marketSection.className = 'market-section';
        // Insert before footer or at end of home page
        const footer = document.querySelector('footer');
        if (footer) homePage.insertBefore(marketSection, footer);
        else homePage.appendChild(marketSection);
    }

    const niftyChange  = nifty?.data ? nifty.data.change >= 0 ? 'up' : 'down' : '';
    const sensexChange = sensex?.data ? sensex.data.change >= 0 ? 'up' : 'down' : '';

    marketSection.innerHTML = `
      <div class="market-title">
        <h2>Market Pulse</h2>
      <span><div class="live-dot"></div> 15-min delayed · Updates every 5 min</span>
        </div>

      <!-- INDEX CARDS -->
      <div class="index-grid">
        <div class="index-card">
          <div class="ic-label">Nifty 50</div>
          ${nifty?.data
            ? `<div class="ic-price">${nifty.data.price.toLocaleString('en-IN', {maximumFractionDigits:2})}</div>
               <div class="ic-change ${niftyChange}">${nifty.data.change >= 0 ? '▲' : '▼'} ${fmtChange(nifty.data.change, nifty.data.changePct)}</div>`
            : '<div class="skeleton"></div>'}
          <div class="ic-sub">NSE India</div>
        </div>
        <div class="index-card">
          <div class="ic-label">Sensex</div>
          ${sensex?.data
            ? `<div class="ic-price">${sensex.data.price.toLocaleString('en-IN', {maximumFractionDigits:2})}</div>
               <div class="ic-change ${sensexChange}">${sensex.data.change >= 0 ? '▲' : '▼'} ${fmtChange(sensex.data.change, sensex.data.changePct)}</div>`
            : '<div class="skeleton"></div>'}
          <div class="ic-sub">BSE India</div>
        </div>
        <div class="index-card">
          <div class="ic-label">Gold (24K)</div>
          <div class="ic-price">₹${goldData.price.toLocaleString('en-IN')}</div>
          <div class="ic-change up">per gram</div>
          <div class="ic-sub">Approx. retail price</div>
        </div>
        <div class="index-card">
          <div class="ic-label">Best FD Rate</div>
          <div class="ic-price">${Math.max(...FD_RATES.map(f => f.rate)).toFixed(2)}%</div>
          <div class="ic-change up">▲ p.a.</div>
          <div class="ic-sub">HDFC / Kotak Bank</div>
        </div>
      </div>

      <!-- GOLD CARD -->
      <div class="gold-card">
        <div class="gold-left">
          <div class="gold-icon">🥇</div>
          <div class="gold-info">
            <div class="label">Gold Price Today</div>
            <div class="price">₹${goldData.price.toLocaleString('en-IN')}<span style="font-size:14px; color:#8a7a00;">/gram</span></div>
            <div class="sub">24 Karat · Approximate retail price including GST</div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; color:#8a7a00; margin-bottom:4px;">Investment tip</div>
          <div style="font-size:12px; color:#FFD166; max-width:200px; line-height:1.5;">Allocate 10-20% of portfolio to gold for stability</div>
        </div>
      </div>

      <div class="market-grid">
        <!-- STOCKS -->
        <div class="market-card">
          <h3>📊 Top Stocks</h3>
          ${stocks.map(s => {
            if (!s.data) return `<div class="stock-row"><span class="stock-name">${s.label}</span><span class="skeleton" style="width:60px;height:14px;"></span></div>`;
            const cls = s.data.change >= 0 ? 'up' : 'down';
            return `
              <div class="stock-row">
                <span class="stock-name">${s.label}</span>
                <span class="stock-price">${fmtPrice(s.data.price)}</span>
                <span class="stock-change ${cls}">${s.data.change >= 0 ? '▲' : '▼'} ${Math.abs(s.data.changePct).toFixed(2)}%</span>
              </div>`;
          }).join('')}
        </div>

        <!-- FD RATES -->
        <div class="market-card">
          <h3>🏦 FD Interest Rates</h3>
          ${FD_RATES.map(f => `
            <div class="fd-row">
              <span class="fd-bank">${f.bank}</span>
              <div style="text-align:right;">
                <div class="fd-rate">${f.rate.toFixed(2)}%</div>
                <div class="fd-tenure">${f.tenure}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
}

// ── INIT ──
async function initMarketData() {
    // Fetch all quotes in parallel
    const results = await Promise.all(
        SYMBOLS.map(async s => ({
            ...s,
            data: await fetchQuote(s.id)
        }))
    );

    const goldData = await fetchGoldPrice();

    buildTicker(results);
    buildMarketSection(results, goldData);

    // Refresh every 5 minutes
    setTimeout(initMarketData, 5 * 60 * 1000);
}

// Start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarketData);
} else {
    initMarketData();
}