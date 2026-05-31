
// ===== DATA =====
const SCHEMES = [
  {
    id:'sip', name:'SIP', fullName:'Mutual Fund via SIP',
    icon:'📈', accent:'#2dce7a',
    tagline:'Invest small amounts monthly in mutual funds',
    risk:'Medium', riskPct:55, returns:'10–14%', lockIn:'None',
    minInvest:'₹500/month', taxBenefit:'ELSS: 80C up to ₹1.5L',
    tags:['tag-med','tag-info'],
    tagLabels:['Medium risk','Equity'],
    type:'sip', rate:12,
    how:`SIP stands for Systematic Investment Plan. Instead of putting a large amount once, you invest a fixed small amount every month — like ₹500 or ₹5,000 — into a mutual fund.
    The fund manager pools your money with thousands of other investors and buys stocks, bonds, or both. Over time, your money grows through the power of compounding.`,
    example:`If you invest ₹5,000 every month for 10 years at 12% annual return, you put in ₹6 Lakh total. But thanks to compounding, you receive back around ₹11.6 Lakh — nearly double.`,
    works:`Each month on a set date, your bank auto-deducts the SIP amount. You get units of the mutual fund at that day's NAV (Net Asset Value). When you redeem, you sell those units at the current NAV.`,
    proscons: {pros:['No large lump sum needed','Rupee cost averaging reduces risk','Can start with just ₹500','Very liquid — can stop anytime'],cons:['Market-linked, can go down short-term','No guaranteed returns','Fund manager fees (expense ratio)']}
  },
  {
    id:'fd', name:'FD', fullName:'Fixed Deposit',
    icon:'🏦', accent:'#4a9eff',
    tagline:'Guaranteed returns from bank deposits',
    risk:'Low', riskPct:15, returns:'6.5–8%', lockIn:'7 days – 10 years',
    minInvest:'₹1,000 (one time)', taxBenefit:'5yr Tax-saver FD: 80C',
    tags:['tag-low','tag-info'],
    tagLabels:['Low risk','Guaranteed'],
    type:'fd', rate:7,
    how:`A Fixed Deposit is the simplest investment. You give your money to a bank for a fixed period (say 1 year or 3 years). The bank promises to pay you a fixed interest rate — no matter what happens in the market.
    At the end of the period, you get your full amount back plus the interest earned.`,
    example:`If you deposit ₹1,00,000 in an FD at 7% for 3 years, you earn ₹22,500 in interest and receive ₹1,22,500 at maturity.`,
    works:`Banks use your FD money to give loans to other people and earn more interest. They pay you a part of that interest. Rates change over time based on the Reserve Bank of India (RBI) policy.`,
    proscons: {pros:['100% safe (DICGC insured up to ₹5L per bank)','Guaranteed returns, no market risk','Easy to open online','Flexible tenure from 7 days to 10 years'],cons:['Returns may not beat inflation','Interest is taxable','Penalty for early withdrawal','Lower returns than equity']}
  },
  {
    id:'ppf', name:'PPF', fullName:'Public Provident Fund',
    icon:'🏛️', accent:'#f5a623',
    tagline:'Government-backed long-term savings with tax benefits',
    risk:'Low', riskPct:10, returns:'7.1%', lockIn:'15 years',
    minInvest:'₹500/year', taxBenefit:'Full EEE exemption (80C)',
    tags:['tag-low','tag-info'],
    tagLabels:['Low risk','Tax-free'],
    type:'sip', rate:7.1,
    how:`PPF (Public Provident Fund) is a government savings scheme. You invest money every year (min ₹500, max ₹1.5 Lakh) and the government guarantees a fixed interest rate. Currently it is 7.1% per year.
    The best part: the money you invest, the interest you earn, and the maturity amount — all three are tax-free. This is called EEE (Exempt-Exempt-Exempt).`,
    example:`If you invest ₹5,000/month (₹60,000/year) for 15 years, you invest ₹9 Lakh total. At 7.1%, you receive around ₹16.3 Lakh — all tax-free.`,
    works:`The government sets the interest rate every quarter. Your money is locked for 15 years (partial withdrawal allowed from year 7). You can open a PPF account at any post office or major bank.`,
    proscons: {pros:['Fully government-backed, zero risk','Triple tax benefit (EEE)','Good long-term return','Can take loan against PPF (year 3–6)'],cons:['15-year lock-in','Max ₹1.5L per year','Interest rate can change quarterly','No option to invest more than 12 times a year']}
  },
  
  {
    id:'stocks', name:'Stocks', fullName:'Direct Stock Market',
    icon:'📊', accent:'#e84040',
    tagline:'Buy ownership in Indian companies directly',
    risk:'High', riskPct:90, returns:'returns are market-dependent', lockIn:'None',
    minInvest:'Price of 1 share', taxBenefit:'LTCG: 10% above ₹1L, STCG: 15%',
    tags:['tag-high','tag-info'],
    tagLabels:['High risk','High return'],
    type:'sip', rate:14,
    how:`When you buy a stock, you buy a small piece of ownership in a company. If the company grows and makes profits, your stock value goes up. If the company struggles, your stock falls.
    Unlike FD or PPF, there are no guaranteed returns. But historically, the Indian stock market (Sensex/Nifty) has given around 12–15% annual returns over long periods.`,
    example:`If you had invested ₹10,000 in Infosys in 2000, it would be worth over ₹3 Crore today. But many stocks also go to zero — which is why diversification matters.`,
    works:`You buy stocks through a Demat account and stockbroker (like Zerodha, Upstox, Angel One). Stock prices change every second during market hours (9:15am–3:30pm Monday–Friday).`,
    proscons: {pros:['Highest potential returns','Full liquidity','Dividends as extra income','Ownership in India\'s top companies'],cons:['Very high risk, can lose money','Needs research and knowledge','Emotional discipline required','Tax on short-term gains (15%)']}
  },
  {
    id:'gold', name:'Gold', fullName:'Gold (SGB / ETF)',
    icon:'🪙', accent:'#f5a623',
    tagline:'Invest in gold digitally without physical storage',
    risk:'Medium', riskPct:45, returns:'8–10% (historical)', lockIn:'8 yrs (SGB)',
    minInvest:'₹1 (ETF) / 1 gram (SGB)', taxBenefit:'SGB: tax-free at maturity',
    tags:['tag-med','tag-info'],
    tagLabels:['Medium risk','Inflation hedge'],
    type:'sip', rate:9,
    how:`Gold has been a store of wealth for thousands of years. Today you don't need to buy physical gold — you can invest digitally via:
    1. Sovereign Gold Bonds (SGB): Government bonds tied to gold price + 2.5% annual interest
    2. Gold ETFs: Buy gold on stock exchange like a share
    3. Digital Gold: Buy fractions of gold online`,
    example:`If you invested ₹5,000/month in gold for 10 years, you'd invest ₹6 Lakh. At 9% average return, you'd receive around ₹9.8 Lakh.`,
    works:`Gold prices are global — driven by USD, oil prices, inflation, and global uncertainty. When stock markets fall, gold often rises — making it a good portfolio hedge.`,
    proscons: {pros:['Hedge against inflation','SGB gives 2.5% extra interest','No storage hassle (digital)','SGB maturity is tax-free'],cons:['No dividends (unlike stocks)','Prices can be volatile short-term','SGB has 8-year lock-in','Not suitable as only investment']}
  },
  {
    id:'nps', name:'NPS', fullName:'National Pension System',
    icon:'👴', accent:'#a78bfa',
    tagline:'Government pension scheme for retirement',
    risk:'Low-Med', riskPct:30, returns:'8–10%', lockIn:'Till age 60',
    minInvest:'₹500/month', taxBenefit:'80C + extra ₹50K under 80CCD(1B)',
    tags:['tag-low','tag-info'],
    tagLabels:['Low-Med risk','Retirement'],
    type:'sip', rate:9,
    how:`NPS (National Pension System) is a government retirement savings scheme. You invest regularly, and at age 60, you receive a lump sum + a monthly pension for life.
    60% of the corpus at retirement is tax-free. The remaining 40% must be used to buy an annuity (monthly pension).`,
    example:`If you invest ₹5,000/month from age 25 to 60 (35 years) at 9%, you build a corpus of around ₹1.6 Crore. 60% = ₹96 Lakh tax-free lump sum + monthly pension from 40%.`,
    works:`NPS money is managed by professional fund managers (like SBI, HDFC, ICICI) who invest in equity, govt bonds, and corporate bonds based on your chosen mix (Tier 1 & Tier 2 accounts).`,
    proscons: {pros:['Extra ₹50K tax deduction (beyond 80C limit)','Low management fees','Government backed','Monthly pension for life after 60'],cons:['Locked till age 60','40% must buy annuity (low returns)','Complex withdrawal rules','Not very flexible']}
  },
  {
    id:'sukanya', name:'SSY', fullName:'Sukanya Samriddhi Yojana',
    icon:'👧', accent:'#f472b6',
    tagline:'Government scheme for girl child education & marriage',
    risk:'Low', riskPct:5, returns:'8.2%', lockIn:'Till girl turns 21',
    minInvest:'₹250/year', taxBenefit:'EEE — fully tax-free',
    tags:['tag-low','tag-info'],
    tagLabels:['Zero risk','Tax-free'],
    type:'sip', rate:8.2,
    how:`Sukanya Samriddhi Yojana (SSY) is a government scheme for parents of girl children. You invest for your daughter's future — for education (partial withdrawal after age 18) or marriage (full withdrawal at age 21).
    The interest rate is 8.2% — one of the highest guaranteed rates available, and fully tax-free.`,
    example:`If you invest ₹5,000/month for 15 years for your daughter, you invest ₹9 Lakh total. At 8.2%, you receive around ₹18 Lakh — fully tax-free.`,
    works:`Account can be opened at any bank or post office for a girl below 10 years. Account matures when the girl turns 21. Investments can be made for 15 years from account opening.`,
    proscons: {pros:['Highest guaranteed rate (8.2%)','Fully tax-free (EEE)','Government guaranteed, zero risk','Perfect for long-term goal planning'],cons:['Only for girl children','Lock-in till age 21','Max ₹1.5L per year','Only 2 accounts per family']}
  },
  {
    id:'bonds', name:'Bonds', fullName:'Government & Corporate Bonds',
    icon:'📋', accent:'#4a9eff',
    tagline:'Loan money to government or companies for fixed interest',
    risk:'Low-Med', riskPct:25, returns:'6–10%(depends on govt/corporate bonds)', lockIn:'1–30 years',
    minInvest:'₹1,000 (Govt bonds)', taxBenefit:'Some bonds are tax-free',
    tags:['tag-low','tag-info'],
    tagLabels:['Low-Med risk','Fixed income'],
    type:'fd', rate:7.5,
    how:`A bond is like giving a loan. When you buy a bond, you are lending money to the government or a company. They promise to pay you regular interest (called coupon) and return your principal at the end.
    Government bonds are safest (backed by India). Corporate bonds give higher interest but have slightly more risk.`,
    example:`If you buy a ₹1,00,000 corporate bond at 9% for 5 years, you receive ₹9,000 every year as interest (₹45,000 total) plus your ₹1,00,000 back at the end.`,
    works:`Bonds are traded on NSE/BSE. You can buy government bonds (G-Secs) directly via RBI Retail Direct. Corporate bonds are available through brokers and apps like Groww, Zerodha.`,
    proscons: {pros:['Regular fixed income','Safer than stocks','Government bonds have zero default risk','Diversifies your portfolio'],cons:['Lower returns than equity over long term','Bond prices fall when interest rates rise','Corporate bonds carry default risk','Less liquid than FD']}
  },
  {
    id:'reit', name:'REIT', fullName:'Real Estate Investment Trust',
    icon:'🏢', accent:'#2dce7a',
    tagline:'Invest in commercial real estate without buying property',
    risk:'Medium', riskPct:50, returns:'7–10%', lockIn:'None',
    minInvest:'₹10,000 approx', taxBenefit:'Dividend partially taxable',
    tags:['tag-med','tag-info'],
    tagLabels:['Medium risk','Real estate'],
    type:'sip', rate:8.5,
    how:`REITs let you invest in real estate without buying an actual property. A REIT company owns large commercial properties (malls, office buildings) and earns rent. They must pay 90% of their income as dividends to investors.
    In India, listed REITs include Embassy REIT, Mindspace REIT, and Brookfield REIT.`,
    example:`If you invest ₹50,000 in a REIT that gives 8% annual dividend, you earn ₹4,000 per year as regular income, plus your investment may grow in value.`,
    works:`REITs are listed on NSE/BSE and can be bought like stocks through a Demat account. The value is linked to property values and rental income, not the stock market directly.`,
    proscons: {pros:['Regular dividend income (like rent)','Real estate exposure without buying property','Listed and liquid on exchanges','Professional property management'],cons:['Sensitive to interest rate changes','Requires Demat account','Dividend tax rules complex','Limited options in India currently']}
  },
  {
    id:'elss', name:'ELSS', fullName:'Equity Linked Savings Scheme',
    icon:'💼', accent:'#2dce7a',
    tagline:'Mutual fund with tax benefit under Section 80C',
    risk:'Medium-High', riskPct:65, returns:'10–15%(market-dependent)', lockIn:'3 years',
    minInvest:'₹500/month', taxBenefit:'80C up to ₹1.5L',
    tags:['tag-med','tag-info'],
    tagLabels:['Med-High risk','Tax saving'],
    type:'sip', rate:12,
    how:`ELSS is a type of mutual fund that invests in stocks AND gives you a tax deduction of up to ₹1.5 Lakh per year under Section 80C. It has the shortest lock-in (3 years) among all 80C investments.
    It combines the benefits of equity mutual funds with tax savings.`,
    example:`If you invest ₹1.5 Lakh in ELSS, you save ₹46,800 in tax (if in 31.2% tax bracket). Plus, at 12% returns over 3 years, your ₹1.5L becomes approximately ₹2.1L.`,
    works:`ELSS funds invest at least 80% in equities. They have a mandatory 3-year lock-in. After 3 years, you can redeem anytime. Many people do a monthly SIP of ₹12,500 (₹1.5L/year) for maximum tax benefit.`,
    proscons: {pros:['Best-in-class tax saving (80C)','Only 3-year lock-in (shortest in 80C)','Potential for high returns','Disciplined long-term equity investing'],cons:['Market risk — value can fall','3-year lock-in per each SIP installment','Returns not guaranteed','Need to stay invested through market crashes']}
  }
  
];
 facts: [
   "PPF has a 15-year lock-in period.",
   "SIP helps reduce market timing risk.",
   "Gold protects against inflation."
]
const LEARN_TOPICS = [
  {
    icon:'🌱', q:'What is compounding?',
    preview:'How money grows on top of money — Einstein\'s 8th wonder explained simply',
    answer:`Compounding means earning interest on your interest. Let's say you invest ₹1,000 at 10% interest. After year 1, you have ₹1,100. In year 2, you earn 10% on ₹1,100 — not just ₹1,000. So you earn ₹110 instead of ₹100.
    Over time, this snowball effect becomes enormous. This is why starting early is so powerful.`,
    example:`₹10,000 invested at 12% for 30 years becomes ₹2.99 Lakh — without adding a single rupee more. The same ₹10,000 at 12% for only 10 years is just ₹31,058. Time is everything.`
  },
  {
    icon:'📅', q:'What is SIP and how is it different from lump sum?',
    preview:'Monthly investing vs one big investment — which is better and when?',
    answer:`SIP (Systematic Investment Plan) means investing a fixed amount every month. Lump sum means investing a large amount all at once.
    The advantage of SIP is "Rupee Cost Averaging" — when markets are low, you automatically buy more units. When markets are high, you buy fewer units. This reduces risk over time.`,
    example:`If you invest ₹1,000/month for 10 years vs ₹1,20,000 in one shot — both invest the same total. But SIP is less risky because you don't time the market. If you invest the lump sum at a market peak, you could wait years to recover.`
  },
  {
    icon:'💰', q:'What is the difference between FD and PPF?',
    preview:'Both are safe investments — but they work very differently',
    answer:`FD (Fixed Deposit): Bank keeps your money for a fixed time and pays interest. Flexible tenure from 7 days to 10 years. Interest is taxable.
    PPF (Public Provident Fund): Government scheme with 15-year lock-in. Interest rate set by govt (currently ~7% (government revised quarterly))). Fully tax-free — both the investment and the returns.`,
    example:`For ₹1 Lakh invested for 5 years: FD at 7% gives ₹40,255 interest (but you pay tax on it). PPF at 7.1% gives ₹40,880 (fully tax-free). If you're in 30% tax bracket, PPF saves you ~₹12,000 in tax on the same investment.`
  },
  {
    icon:'⚖️', q:'What is risk in investing?',
    preview:'Why some investments can lose value and others never do',
    answer:`Risk means the possibility that your investment can go down in value, or that you may get less than you expected. All investments carry some kind of risk.
    Types of risk: Market risk (stocks fall), Inflation risk (FD returns beat by inflation), Liquidity risk (can't sell when needed), Credit risk (company defaults on bond).`,
    example:`₹1,00,000 in FD at 6% for 1 year = ₹1,06,000 (certain, safe). ₹1,00,000 in stocks — could be ₹80,000 or ₹1,40,000 after 1 year. Higher the risk, higher the potential reward. But there's no free lunch.`
  },
  {
    icon:'🏛️', q:'What is Section 80C and how does it save tax?',
    preview:'How investing the right way can legally reduce your tax bill',
    answer:`Section 80C of the Income Tax Act allows you to deduct up to ₹1.5 Lakh per year from your taxable income by investing in specific instruments.
    If your income is ₹10 Lakh and you invest ₹1.5 Lakh in 80C instruments, you're taxed on only ₹8.5 Lakh. This saves ₹46,800 per year if you're in the 31.2% tax bracket.`,
    example:`80C eligible investments: PPF, ELSS, 5-year FD, NPS, SSY, Life Insurance (LIC), EPF. Strategy: Fill up to ₹1.5L using ELSS (best returns) or PPF (best safety). Then use 80CCD(1B) for extra ₹50K via NPS.`
  },
  {
    icon:'📉', q:'What happens if the market crashes?',
    preview:'What to do when your investments go red — and why panic is the worst move',
    answer:`Every market crash feels like the end — but markets have always recovered. In 2008, Nifty fell 60%. By 2010, it was back at the same level. In COVID (March 2020), Nifty fell 38%. By November 2020, it hit all-time highs.
    If you have SIP investments and the market crashes, the best thing to do is: keep investing. You are now buying more units at lower prices — called averaging down.`,
    example:`Imagine you buy 100 units at ₹100 (invested ₹10,000). Market crashes, units fall to ₹60. You buy 100 more units (₹6,000 invested). Your average cost is now ₹80/unit. When the market recovers to ₹100, you profit — even though it's at the same price as when you started.`
  },
  {
    icon:'🎯', q:'How much should I invest each month?',
    preview:'A simple formula to figure out how much you need to save',
    answer:`A common rule: save and invest at least 20% of your take-home salary. If you earn ₹30,000/month, invest ₹6,000.
    A better approach: identify your goal first. Do you want ₹50 Lakh for a house in 10 years? Work backwards with the SIP calculator to find exactly how much to invest per month at your expected return.`,
    example:`Want ₹50 Lakh in 10 years at 12% returns? You need to invest approximately ₹22,244 per month. Want ₹1 Crore in 15 years at 12%? You need about ₹20,017 per month. Start with what you can — even ₹500/month builds the habit.`
  },
  {
    icon:'🔄', q:'What is Rupee Cost Averaging?',
    preview:'How SIP automatically reduces your risk in a volatile market',
    answer:`Rupee Cost Averaging (RCA) means that when you invest a fixed amount every month, you automatically buy MORE units when prices are low, and FEWER units when prices are high.
    Over time, your average cost per unit becomes lower than the average price — giving you better returns.`,
    example:`Month 1: Unit price ₹100 → ₹1,000 buys 10 units. Month 2: Price falls to ₹50 → ₹1,000 buys 20 units. Month 3: Price rises to ₹80 → ₹1,000 buys 12.5 units. Total: ₹3,000 invested, 42.5 units bought. Average cost = ₹70.6/unit. Average price was ₹76.7 — you beat it automatically.`
  },
  {
  icon:'🏦',
  q:'What is a Bond?',
  preview:'How companies and governments borrow money from investors',
  answer:`A bond is a fixed income investment where you lend money to a company or government for a fixed period. In return, they pay you regular interest called coupon payments.
  Bonds are generally considered safer than stocks because bondholders are paid before shareholders during financial problems.`,

  example:`If you buy a ₹10,000 bond with 8% annual coupon rate, you receive ₹800 every year until maturity. At maturity, your original ₹10,000 is returned.`
},

{
  icon:'📈',
  q:'What is Repo Rate?',
  preview:'How RBI controls inflation, borrowing and economic growth',
  answer:`Repo rate is the interest rate at which RBI lends money to commercial banks. When RBI increases repo rate, loans become expensive and spending reduces. When RBI reduces repo rate, borrowing becomes cheaper and economic activity increases.`,

  example:`If repo rate increases from 6% to 7%, home loans and business loans usually become costlier. This helps reduce inflation by lowering spending in the economy.`
},

{
  icon:'🛡️',
  q:'What are AAA and BBB bond ratings?',
  preview:'Understanding bond safety and credit risk',
  answer:`Credit ratings show how safe a bond is. AAA-rated bonds are considered very safe with low default risk. BBB-rated bonds carry moderate risk and usually offer slightly higher returns.`,

  example:`Government-backed or financially strong companies may issue AAA bonds with 7% returns. Smaller or riskier companies may offer BBB bonds with 10% returns to attract investors.`
},

{
  icon:'💵',
  q:'What is Coupon Rate?',
  preview:'The fixed interest income paid by bonds',
  answer:`Coupon rate is the fixed annual interest percentage paid by a bond issuer to investors. This percentage remains fixed throughout the bond period regardless of market conditions.`,

  example:`A ₹1,00,000 bond with 9% coupon rate pays ₹9,000 interest every year until maturity.`
},

{
  icon:'⚔️',
  q:'Fixed Income vs Equity — what is the difference?',
  preview:'Stability versus growth in investing',
  answer:`Fixed income investments like bonds and FDs provide stable returns with lower risk. Equity investments like stocks provide higher growth potential but can fluctuate heavily in value.`,

  example:`₹1 lakh in FD may become ₹1.06 lakh after a year safely. ₹1 lakh in stocks could become ₹80,000 or ₹1.40 lakh depending on market performance.`
},

{
  icon:'🪜',
  q:'What is Bond Laddering?',
  preview:'A smart strategy for liquidity and risk management',
  answer:`Bond laddering means investing in multiple bonds with different maturity periods instead of investing all money in one bond. This improves liquidity and reduces reinvestment risk.`,

  example:`Instead of investing ₹5 lakh in one 10-year bond, you can invest ₹1 lakh each in 2-year, 4-year, 6-year, 8-year and 10-year bonds.`
}
];
 
