// ── RUPEE RISE PDF REPORT GENERATOR ──
// Add this script to dashboard.html before </body>

function generatePDFReport() {
    const user    = JSON.parse(localStorage.getItem('rr_user') || '{}');
    const finance = JSON.parse(localStorage.getItem('rr_finance') || '{}');

    if (!finance.salary) {
        alert('Please complete your financial planner first!');
        return;
    }

    function fmt(num) {
        if (!num) return '₹0';
        if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
        if (num >= 100000)   return '₹' + (num / 100000).toFixed(1) + 'L';
        if (num >= 1000)     return '₹' + (num / 1000).toFixed(1) + 'K';
        return '₹' + Math.round(num).toLocaleString();
    }

    function getGrade(score) {
        if (score >= 80) return { label: 'Excellent', color: '#00C896' };
        if (score >= 60) return { label: 'Good', color: '#00C896' };
        if (score >= 40) return { label: 'Average', color: '#F39C12' };
        if (score >= 20) return { label: 'Poor', color: '#E74C3C' };
        return { label: 'Critical', color: '#E74C3C' };
    }

    const {
        salary=0, savings=0, food=0, rent=0, petrol=0, bills=0,
        shopping=0, entertainment=0, emi=0, loanOutstanding=0,
        risk='medium', score=0, sip=0,
        hasHealth=false, hasTerm=false, hasVehicle=false, hasEmergency=false
    } = finance;

    const totalExpense = food + rent + petrol + bills + shopping + entertainment + emi;
    const savingsRate  = salary > 0 ? Math.round((savings / salary) * 100) : 0;
    const debtRatio    = salary > 0 ? Math.round((emi / salary) * 100) : 0;
    const grade        = getGrade(score);
    const date         = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // SIP projection
    const monthlyReturn = 12 / 12 / 100;
    let proj5 = 0, proj10 = 0, proj20 = 0;
    let total = 0;
    for (let m = 1; m <= 240; m++) {
        total = (total + sip) * (1 + monthlyReturn);
        if (m === 60)  proj5  = total;
        if (m === 120) proj10 = total;
        if (m === 240) proj20 = total;
    }

    const recommendations = [];
    if (!hasHealth)       recommendations.push('🔴 Get Health Insurance immediately — covers medical emergencies');
    if (!hasTerm)         recommendations.push('🔴 Buy Term Insurance — protect your family for ₹500-1000/month');
    if (!hasEmergency)    recommendations.push('⚠️ Build Emergency Fund of ' + fmt(totalExpense * 6) + ' (6 months expenses)');
    if (debtRatio > 40)   recommendations.push('⚠️ EMI burden too high (' + debtRatio + '%) — prepay loans to reduce it');
    if (savingsRate < 20) recommendations.push('⚠️ Increase savings rate to at least 20% of income');
    if (sip > 0)          recommendations.push('✅ Keep investing ' + fmt(sip) + '/month via SIP for long-term wealth');
    if (recommendations.length === 0) recommendations.push('✅ Excellent financial health! Keep maintaining your discipline.');

    const reportHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>RupeeRise Financial Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 13px; }

  .header {
    background: linear-gradient(135deg, #0a1a0d, #0d2020);
    color: white; padding: 32px 40px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .header-left h1 { font-size: 28px; color: #00C896; letter-spacing: -0.5px; }
  .header-left p { color: #6b8f6b; font-size: 12px; margin-top: 4px; }
  .header-right { text-align: right; }
  .header-right .name { font-size: 18px; font-weight: 600; }
  .header-right .date { font-size: 11px; color: #6b8f6b; margin-top: 4px; }

  .score-section {
    background: #f8fffe; border-bottom: 2px solid #e8f5e8;
    padding: 28px 40px; display: flex; align-items: center; gap: 32px;
  }
  .score-circle {
    width: 100px; height: 100px; border-radius: 50%;
    border: 6px solid ${grade.color};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .score-circle .num { font-size: 32px; font-weight: 700; color: ${grade.color}; line-height: 1; }
  .score-circle .lbl { font-size: 10px; color: #888; }
  .score-info h2 { font-size: 20px; color: ${grade.color}; margin-bottom: 6px; }
  .score-info p { font-size: 12px; color: #666; line-height: 1.6; max-width: 500px; }

  .content { padding: 28px 40px; }

  .section { margin-bottom: 28px; }
  .section-title {
    font-size: 14px; font-weight: 700; color: #00C896;
    text-transform: uppercase; letter-spacing: 0.08em;
    border-bottom: 2px solid #e8f5e8; padding-bottom: 8px; margin-bottom: 16px;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

  .stat-box {
    background: #f8fffe; border: 1px solid #e0f0e8;
    border-radius: 10px; padding: 14px; text-align: center;
  }
  .stat-box .val { font-size: 20px; font-weight: 700; color: #00C896; }
  .stat-box .lbl { font-size: 10px; color: #888; margin-top: 4px; text-transform: uppercase; }

  table { width: 100%; border-collapse: collapse; }
  th { background: #f0faf5; color: #333; font-size: 11px; font-weight: 600;
       text-transform: uppercase; padding: 10px 12px; text-align: left;
       border-bottom: 2px solid #e0f0e8; }
  td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 12px; }
  tr:last-child td { border-bottom: none; }
  .green { color: #00C896; font-weight: 600; }
  .red { color: #E74C3C; font-weight: 600; }
  .yellow { color: #F39C12; font-weight: 600; }

  .ins-row { display: flex; justify-content: space-between; align-items: center;
             padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
  .ins-row:last-child { border-bottom: none; }
  .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge.ok { background: #e8faf3; color: #00C896; }
  .badge.bad { background: #fef0f0; color: #E74C3C; }

  .rec-item { display: flex; align-items: flex-start; gap: 10px;
              padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;
              background: #f8fffe; border: 1px solid #e0f0e8; font-size: 12px; line-height: 1.5; }

  .proj-box {
    background: linear-gradient(135deg, #f0faf5, #f8fffe);
    border: 1px solid #e0f0e8; border-radius: 10px;
    padding: 16px; text-align: center;
  }
  .proj-box .amt { font-size: 22px; font-weight: 700; color: #00C896; }
  .proj-box .yr { font-size: 11px; color: #888; margin-top: 4px; }

  .footer {
    background: #f8fffe; border-top: 2px solid #e8f5e8;
    padding: 16px 40px; text-align: center;
    font-size: 11px; color: #888; line-height: 1.7;
  }
  .footer strong { color: #00C896; }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="header-left">
    <h1>RupeeRise</h1>
    <p>Financial Health Report</p>
  </div>
  <div class="header-right">
    <div class="name">${user.fullname || 'Investor'}</div>
    <div class="date">Generated on ${date}</div>
    <div style="font-size:11px; color:#6b8f6b; margin-top:2px;">${user.email || ''}</div>
  </div>
</div>

<!-- SCORE -->
<div class="score-section">
  <div class="score-circle">
    <div class="num">${score}</div>
    <div class="lbl">/ 100</div>
  </div>
  <div class="score-info">
    <h2>${grade.label} Financial Health</h2>
    <p>Your financial health score is <strong>${score}/100</strong>. 
    ${score >= 70 ? 'You are in great financial shape! Keep up the discipline and continue your SIP investments.' 
    : score >= 40 ? 'You are on the right track but there are some areas that need improvement. Focus on insurance and emergency fund.'
    : 'Your finances need immediate attention. Start with health insurance and building an emergency fund.'}</p>
  </div>
</div>

<table>
<tr>
    <th>Period</th>
    <th>Total Invested</th>
    <th>Estimated Value</th>
</tr>

<tr>
    <td>5 Years</td>
    <td>${fmt(sip * 60)}</td>
    <td>${fmt(Math.round(proj5))}</td>
</tr>

<tr>
    <td>10 Years</td>
    <td>${fmt(sip * 120)}</td>
    <td>${fmt(Math.round(proj10))}</td>
</tr>

<tr>
    <td>20 Years</td>
    <td>${fmt(sip * 240)}</td>
    <td>${fmt(Math.round(proj20))}</td>
</tr>

</table>

<div class="content">

  <!-- INCOME OVERVIEW -->
  <div class="section">
    <div class="section-title">💰 Income & Savings Overview</div>
    <div class="grid-4">
      <div class="stat-box"><div class="val">${fmt(salary)}</div><div class="lbl">Monthly Income</div></div>
      <div class="stat-box"><div class="val">${fmt(savings)}</div><div class="lbl">Monthly Savings</div></div>
      <div class="stat-box"><div class="val">${savingsRate}%</div><div class="lbl">Savings Rate</div></div>
      <div class="stat-box"><div class="val">${fmt(sip)}</div><div class="lbl">Suggested SIP</div></div>
    </div>
  </div>

  <!-- EXPENSE BREAKDOWN -->
  <div class="section">
    <div class="section-title">💸 Monthly Expense Breakdown</div>
    <table>
      <tr><th>Category</th><th>Amount</th><th>% of Income</th><th>Status</th></tr>
      ${food > 0 ? `<tr><td>Food & Groceries</td><td>${fmt(food)}</td><td>${Math.round(food/salary*100)}%</td><td class="${food/salary > 0.3 ? 'yellow' : 'green'}">${food/salary > 0.3 ? 'High' : 'OK'}</td></tr>` : ''}
      ${rent > 0 ? `<tr><td>Rent / Housing</td><td>${fmt(rent)}</td><td>${Math.round(rent/salary*100)}%</td><td class="${rent/salary > 0.4 ? 'red' : 'green'}">${rent/salary > 0.4 ? 'Very High' : 'OK'}</td></tr>` : ''}
      ${petrol > 0 ? `<tr><td>Transport / Petrol</td><td>${fmt(petrol)}</td><td>${Math.round(petrol/salary*100)}%</td><td class="green">OK</td></tr>` : ''}
      ${bills > 0 ? `<tr><td>Bills & Utilities</td><td>${fmt(bills)}</td><td>${Math.round(bills/salary*100)}%</td><td class="green">OK</td></tr>` : ''}
      ${shopping > 0 ? `<tr><td>Shopping</td><td>${fmt(shopping)}</td><td>${Math.round(shopping/salary*100)}%</td><td class="${shopping/salary > 0.15 ? 'yellow' : 'green'}">${shopping/salary > 0.15 ? 'Reduce' : 'OK'}</td></tr>` : ''}
      ${entertainment > 0 ? `<tr><td>Entertainment</td><td>${fmt(entertainment)}</td><td>${Math.round(entertainment/salary*100)}%</td><td class="${entertainment/salary > 0.1 ? 'yellow' : 'green'}">${entertainment/salary > 0.1 ? 'Reduce' : 'OK'}</td></tr>` : ''}
      ${emi > 0 ? `<tr><td>Loan EMI</td><td>${fmt(emi)}</td><td>${debtRatio}%</td><td class="${debtRatio > 40 ? 'red' : debtRatio > 20 ? 'yellow' : 'green'}">${debtRatio > 40 ? 'Danger' : debtRatio > 20 ? 'High' : 'OK'}</td></tr>` : ''}
      <tr style="font-weight:700; background:#f0faf5;">
        <td>Total Expenses</td><td>${fmt(totalExpense)}</td><td>${Math.round(totalExpense/salary*100)}%</td>
        <td class="${totalExpense/salary > 0.8 ? 'red' : 'green'}">${totalExpense/salary > 0.8 ? 'Too High' : 'Manageable'}</td>
      </tr>
    </table>
  </div>

  <!-- SIP PROJECTION -->
  <div class="section">
<div style="page-break-before: always;"></div>

<div class="section-title">
📈 SIP Growth Projection (at 12% annual return)
</div> 
   <table>
<tr>
    <th>Period</th>
    <th>Total Invested</th>
    <th>Estimated Value</th>
</tr>

<tr>
    <td>5 Years</td>
    <td>${fmt(sip * 60)}</td>
    <td>${fmt(Math.round(proj5))}</td>
</tr>

<tr>
    <td>10 Years</td>
    <td>${fmt(sip * 120)}</td>
    <td>${fmt(Math.round(proj10))}</td>
</tr>

<tr>
    <td>20 Years</td>
    <td>${fmt(sip * 240)}</td>
    <td>${fmt(Math.round(proj20))}</td>
</tr>

</table>
  </div>

  <div class="grid-2">
    <!-- INSURANCE -->
    <div class="section">
      <div class="section-title">🛡️ Insurance Status</div>
      <div class="ins-row"><span>🏥 Health Insurance</span><span class="badge ${hasHealth ? 'ok' : 'bad'}">${hasHealth ? 'Covered ✅' : 'Missing ❌'}</span></div>
      <div class="ins-row"><span>🛡️ Term Insurance</span><span class="badge ${hasTerm ? 'ok' : 'bad'}">${hasTerm ? 'Covered ✅' : 'Missing ❌'}</span></div>
      <div class="ins-row"><span>🚗 Vehicle Insurance</span><span class="badge ${hasVehicle ? 'ok' : 'bad'}">${hasVehicle ? 'Covered ✅' : 'Missing ❌'}</span></div>
      <div class="ins-row"><span>💰 Emergency Fund</span><span class="badge ${hasEmergency ? 'ok' : 'bad'}">${hasEmergency ? 'Ready ✅' : 'Missing ❌'}</span></div>
      ${loanOutstanding > 0 ? `<div class="ins-row"><span>🏦 Outstanding Loan</span><span style="font-weight:600;color:#E74C3C;">${fmt(loanOutstanding)}</span></div>` : ''}
    </div>

    <!-- RECOMMENDATIONS -->
    <div class="section">
      <div class="section-title">💡 Recommendations</div>
      ${recommendations.map(r => `<div class="rec-item">${r}</div>`).join('')}
    </div>
  </div>

</div>

<!-- FOOTER -->
<div class="footer">
  <strong>RupeeRise Financial Report</strong> · Generated for ${user.fullname || 'Investor'} on ${date}<br>
  ⚠️ This report is for educational purposes only. Please consult a SEBI-registered financial advisor before making investment decisions.<br>
  Returns shown are estimates based on historical data and not guaranteed.
</div>

</body>
</html>`;

    const element = document.createElement("div");
element.innerHTML = reportHTML;

html2pdf()
    .set({
        margin: 10,
        filename: 'RupeeRise_Report.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
    scale: 1,
    letterRendering: true
},
pagebreak: {
    mode: ['avoid-all', 'css', 'legacy']
},
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    })
    .from(element)
    .save();
}