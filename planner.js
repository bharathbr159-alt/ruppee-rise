console.log("Planner JS Loaded");

let allocationChart;

// ── GET CURRENT USER ID ──
function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('rr_user') || '{}');
    return user.id || user.email || user.name || '__guest__';
}

// ── PARSE AMOUNT: supports 10k=10,000 | 1.5L=1,50,000 | 2Cr=2,00,00,000 ──
function parseAmount(val) {
    if (!val) return 0;
    const str = String(val).trim().toLowerCase().replace(/,/g, "");
    if (str.endsWith("cr")) return parseFloat(str) * 10000000;
    if (str.endsWith("l"))  return parseFloat(str) * 100000;
    if (str.endsWith("k"))  return parseFloat(str) * 1000;
    return parseFloat(str) || 0;
}

// ── FORMAT AMOUNT: 10000 → 10K, 100000 → 1L ──
function formatAmount(num) {
    if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
    if (num >= 100000)   return (num / 100000).toFixed(1).replace(/\.0$/, "") + "L";
    if (num >= 1000)     return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return Math.round(num).toLocaleString();
}

// ── AUTO-LOAD saved data on page open ──
window.addEventListener('load', async () => {
    const savedUser = JSON.parse(localStorage.getItem('rr_user') || '{}');
    if (!savedUser.id) return;

    try {
        const res = await fetch(`http://localhost:5000/load-finance/${savedUser.id}`);
        const data = await res.json();
        if (!data.salary) return;

        const fields = ['salary','savings','food','rent','petrol','bills','shopping','entertainment','emi'];
        fields.forEach(f => {
            const el = document.getElementById(f);
            if (el && data[f]) el.value = formatAmount(data[f]);
        });
        if (data.loanOutstanding) document.getElementById('loanOutstanding').value = formatAmount(data.loanOutstanding);
        if (data.risk) document.getElementById('risk').value = data.risk;
        if (data.years) document.getElementById('years').value = data.years;

        analyzePlan();
    } catch(e) {
        console.log("No saved data found");
    }
});

// ── MAIN ANALYZE FUNCTION ──
function analyzePlan() {
    const salary        = parseAmount(document.getElementById("salary").value);
    const savings       = parseAmount(document.getElementById("savings").value);
    const food          = parseAmount(document.getElementById("food").value);
    const rent          = parseAmount(document.getElementById("rent").value);
    const petrol        = parseAmount(document.getElementById("petrol").value);
    const bills         = parseAmount(document.getElementById("bills").value);
    const shopping      = parseAmount(document.getElementById("shopping").value);
    const entertainment = parseAmount(document.getElementById("entertainment").value);
    const emi           = parseAmount(document.getElementById("emi").value);
    const loanOut       = parseAmount(document.getElementById("loanOutstanding").value);
    const risk          = document.getElementById("risk").value;
    const years         = parseAmount(document.getElementById("years").value) || 10;

    const hasHealth    = document.getElementById("hasHealth").checked;
    const hasTerm      = document.getElementById("hasTerm").checked;
    const hasVehicle   = document.getElementById("hasVehicle").checked;
    const hasEmergency = document.getElementById("hasEmergency").checked;

    if (salary === 0) {
        alert("Please enter at least your monthly income! (e.g. 50k or 1.5L)");
        return;
    }

    const totalExpense  = food + rent + petrol + bills + shopping + entertainment + emi;
    const disposable    = salary - totalExpense;
    const savingsRate   = salary > 0 ? Math.round((savings / salary) * 100) : 0;
    const debtRatio     = salary > 0 ? Math.round((emi / salary) * 100) : 0;
    const emergencyFund = totalExpense * 6;
    const sipAmount     = Math.max(Math.round(disposable * 0.35), 500);

    // ── SCORE ──
    let score = 0;
    const vulns = [];

    if (savingsRate >= 30)      { score += 25; vulns.push({ status: "ok",   text: `Savings rate ${savingsRate}% — Excellent!` }); }
    else if (savingsRate >= 20) { score += 18; vulns.push({ status: "ok",   text: `Savings rate ${savingsRate}% — Good` }); }
    else if (savingsRate >= 10) { score += 10; vulns.push({ status: "warn", text: `Savings rate ${savingsRate}% — Try to reach 20%` }); }
    else                        { score += 3;  vulns.push({ status: "bad",  text: `Savings rate ${savingsRate}% — Very low` }); }

    if (debtRatio === 0)        { score += 20; vulns.push({ status: "ok",   text: "No EMI burden — Great!" }); }
    else if (debtRatio <= 20)   { score += 15; vulns.push({ status: "ok",   text: `EMI is ${debtRatio}% of income — Manageable` }); }
    else if (debtRatio <= 40)   { score += 8;  vulns.push({ status: "warn", text: `EMI is ${debtRatio}% of income — High` }); }
    else                        { score += 2;  vulns.push({ status: "bad",  text: `EMI is ${debtRatio}% of income — Danger zone!` }); }

    if (hasHealth)    { score += 15; vulns.push({ status: "ok",   text: "Health Insurance — Covered ✅" }); }
    else              { vulns.push({ status: "bad",  text: "No Health Insurance — Major risk!" }); }

    if (hasTerm)      { score += 15; vulns.push({ status: "ok",   text: "Term Insurance — Family protected ✅" }); }
    else              { vulns.push({ status: "bad",  text: "No Term Insurance — Family at risk!" }); }

    if (hasEmergency) { score += 15; vulns.push({ status: "ok",   text: "Emergency Fund — Ready ✅" }); }
    else              { vulns.push({ status: "bad",  text: `No Emergency Fund — Need ₹${formatAmount(emergencyFund)}` }); }

    if (hasVehicle)   { score += 5;  vulns.push({ status: "ok",   text: "Vehicle Insurance — Covered ✅" }); }
    else              { vulns.push({ status: "warn", text: "No Vehicle Insurance" }); }

    if (disposable > 0) { score += 5; }
    else { vulns.push({ status: "bad", text: "Expenses exceed income!" }); }

    score = Math.min(100, Math.max(0, score));

    // ── GRADE ──
    let grade, gradeColor;
    if      (score >= 80) { grade = "Excellent 🌟 — Financially Strong";    gradeColor = "#00C896"; }
    else if (score >= 60) { grade = "Good 👍 — On the right track";          gradeColor = "#00C896"; }
    else if (score >= 40) { grade = "Average ⚠️ — Needs improvement";        gradeColor = "#FFD166"; }
    else if (score >= 20) { grade = "Poor 🔴 — High financial risk";         gradeColor = "#FF6B6B"; }
    else                  { grade = "Critical 🚨 — Take action immediately"; gradeColor = "#FF6B6B"; }

    // ── UPDATE UI ──
    const ring = document.getElementById("scoreRing");
    ring.style.strokeDashoffset = 490 - (score / 100) * 490;
    ring.style.stroke = gradeColor;

    const numEl = document.getElementById("scoreNumber");
    numEl.style.color = gradeColor;
    animateNumber(numEl, 0, score, 1000);
    document.getElementById("scoreGrade").textContent = grade;

    document.getElementById("vulnList").innerHTML = vulns.map(v => `
        <div class="vuln-item ${v.status}">
            <div class="vuln-dot ${v.status}"></div>
            ${v.text}
        </div>
    `).join("");

    document.getElementById("emergencyFund").textContent = `₹${formatAmount(emergencyFund)}`;
    document.getElementById("sipPlan").textContent       = `₹${formatAmount(sipAmount)}`;
    document.getElementById("debtRatio").textContent     = `${debtRatio}%`;
    document.getElementById("savingsRate").textContent   = `${savingsRate}%`;

    // ── ALLOCATION ──
    let bond, gold, equity, recommendation;
    if (risk === "low") {
        bond = 60; gold = 20; equity = 20;
        recommendation = "PPF, FD, Bonds, Debt Mutual Funds";
    } else if (risk === "medium") {
        bond = 30; gold = 20; equity = 50;
        recommendation = "SIP, Balanced Mutual Funds, Gold ETF";
    } else {
        bond = 10; gold = 10; equity = 80;
        recommendation = "Direct Stocks, Equity Mutual Funds, Index Funds";
    }

    document.getElementById("allocGrid").innerHTML = `
        <div class="alloc-row">
            <div class="alloc-label">Equity</div>
            <div class="alloc-bar-wrap"><div class="alloc-bar" style="width:${equity}%; background:#4f7cff;"></div></div>
            <div class="alloc-pct">${equity}%</div>
        </div>
        <div class="alloc-row">
            <div class="alloc-label">Bonds</div>
            <div class="alloc-bar-wrap"><div class="alloc-bar" style="width:${bond}%; background:#00C896;"></div></div>
            <div class="alloc-pct">${bond}%</div>
        </div>
        <div class="alloc-row">
            <div class="alloc-label">Gold</div>
            <div class="alloc-bar-wrap"><div class="alloc-bar" style="width:${gold}%; background:#FFD166;"></div></div>
            <div class="alloc-pct">${gold}%</div>
        </div>
    `;

    loadAllocationChart(bond, gold, equity);

    document.getElementById("result").innerHTML = `
        <h3 style="color:var(--green); margin-bottom:10px;">📋 ${recommendation}</h3>
        <p style="font-size:13px; color:#6b8f6b; line-height:1.7;">
            Based on your ₹${formatAmount(salary)} income and <strong>${risk} risk</strong> profile.
            Suggested SIP: <strong style="color:var(--green)">₹${formatAmount(sipAmount)}/month</strong>.
            ${loanOut > 0 ? `<br>⚠️ Outstanding loan of ₹${formatAmount(loanOut)} — prioritize paying off high-interest debt first.` : ""}
        </p>
    `;

    let insight = `💡 `;
    if (score >= 70) insight += `Your financial health looks solid! Keep investing ₹${formatAmount(sipAmount)}/month through SIPs.`;
    else if (score >= 40) insight += `You're on the right path but have some gaps. `;
    else insight += `Your finances need immediate attention. `;

    if (!hasHealth) insight += ` 🔴 Get health insurance — a medical emergency can wipe out savings.`;
    if (!hasTerm && salary > 30000) insight += ` 🔴 Term insurance is critical — protect your family for ₹500-1000/month.`;
    if (!hasEmergency) insight += ` ⚠️ Build an emergency fund of ₹${formatAmount(emergencyFund)} (6 months expenses).`;
    if (debtRatio > 40) insight += ` 🔴 EMI burden very high — try to prepay loans.`;
    if (savingsRate < 10) insight += ` ⚠️ Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings.`;

    document.getElementById("insightBox").innerHTML = insight;

    document.getElementById("ynMonthlyExpense").value = totalExpense ? formatAmount(totalExpense) : "";
    document.getElementById("ynMonthlySip").value = sipAmount ? formatAmount(sipAmount) : "";

    // ── AUTO-SAVE to database ──
    const currentUser = JSON.parse(localStorage.getItem('rr_user') || '{}');
    if (currentUser.id) {
        fetch('http://localhost:5000/save-finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                salary, savings, food, rent, petrol, bills,
                shopping, entertainment, emi,
                loanOutstanding: loanOut,
                risk, years, score, sip: sipAmount
            })
        }).then(() => console.log("✅ Finance data saved!"))
          .catch(e => console.log("Save error:", e));
    }

    // ✅ FIX: Save under per-user key so users never share finance data
    const uid = getCurrentUserId();
    localStorage.setItem('rr_finance_' + uid, JSON.stringify({
        salary, savings, food, rent, petrol, bills,
        shopping, entertainment, emi,
        loanOutstanding: loanOut,
        risk, years, score, sip: sipAmount,
        hasHealth, hasTerm, hasVehicle, hasEmergency
    }));
}

// ── GOAL PLANNER ──
function calculateGoal() {
    const target    = parseAmount(document.getElementById("goalAmount").value);
    const sip       = parseAmount(document.getElementById("goalSip").value);
    const annReturn = parseAmount(document.getElementById("goalReturn").value) || 12;
    const lumpsum   = parseAmount(document.getElementById("goalLumpsum").value) || 0;

    if (!target || !sip) { alert("Please enter target amount and SIP! (e.g. 4Cr, 15k)"); return; }

    const monthlyReturn = annReturn / 12 / 100;
    let total = lumpsum;
    let months = 0;

    while (total < target && months < 1200) {
        total = (total + sip) * (1 + monthlyReturn);
        months++;
    }

    const years = (months / 12).toFixed(1);
    const resultEl = document.getElementById("goalResult");
    resultEl.style.display = "block";
    resultEl.innerHTML = `
        You can reach <strong>₹${formatAmount(target)}</strong> in approximately <strong>${years} years</strong>.<br>
        Total invested: <strong>₹${formatAmount(sip * months + lumpsum)}</strong> &nbsp;|&nbsp;
        Wealth gained: <strong>₹${formatAmount(Math.round(total - sip * months - lumpsum))}</strong><br>
        <span style="color:#6b8f6b; font-size:12px;">At ${annReturn}% annual return with ₹${formatAmount(sip)}/month SIP${lumpsum ? ` + ₹${formatAmount(lumpsum)} lump sum` : ""}.</span>
    `;
}

// ── YEAR NUMBER ──
function calculateYearNumber() {
    const monthlyExp  = parseAmount(document.getElementById("ynMonthlyExpense").value);
    const currentSav  = parseAmount(document.getElementById("ynCurrentSavings").value) || 0;
    const monthlySip  = parseAmount(document.getElementById("ynMonthlySip").value);
    const annReturn   = parseAmount(document.getElementById("ynReturn").value) || 12;

    if (!monthlyExp || !monthlySip) { alert("Please enter monthly expenses and SIP!"); return; }

    const targetCorpus  = (monthlyExp * 12) / 0.04;
    const monthlyReturn = annReturn / 12 / 100;
    let total  = currentSav;
    let months = 0;

    while (total < targetCorpus && months < 1200) {
        total = (total + monthlySip) * (1 + monthlyReturn);
        months++;
    }

    const years          = (months / 12).toFixed(1);
    const passiveMonthly = Math.round((targetCorpus * 0.04) / 12);

    const resultEl = document.getElementById("yearResult");
    resultEl.style.display = "block";
    resultEl.innerHTML = `
        🏁 Financial Independence in <strong>${years} years</strong>.<br>
        Target corpus: <strong>₹${formatAmount(Math.round(targetCorpus))}</strong><br>
        Passive income: <strong>₹${formatAmount(passiveMonthly)}/month</strong><br>
        <span style="color:#6b8f6b; font-size:12px;">Based on 4% safe withdrawal rate at ${annReturn}% return.</span>
    `;
}

// ── CHART ──
function loadAllocationChart(bond, gold, equity) {
    const ctx = document.getElementById("allocationChart");
    if (allocationChart) allocationChart.destroy();
    allocationChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Equity", "Bonds", "Gold"],
            datasets: [{
                data: [equity, bond, gold],
                backgroundColor: ["#4f7cff", "#00C896", "#FFD166"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#e8f5e8", font: { family: "Sora" } } }
            }
        }
    });
}

// ── ANIMATE NUMBER ──
function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function update(time) {
        const progress = Math.min((time - start) / duration, 1);
        el.textContent = Math.round(from + (to - from) * progress);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}