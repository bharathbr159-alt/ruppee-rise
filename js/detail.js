let detailChart = null;
 
function renderDetail(s) {
  const invested = 5000 * 12 * 10;
  const final = s.type === 'sip' ? Math.round(calcSIP(5000, s.rate, 10)) : Math.round(calcFD(60000, s.rate, 10));
  const profit = final - invested;
 
  document.getElementById('detail-content').innerHTML = `
    <div class="detail-back" onclick="showPage('schemes')">← Back to all schemes</div>
    <div class="detail-header">
      <div class="detail-icon">${s.icon}</div>
      <div>
        <div class="detail-title">${s.fullName}</div>
        <div class="detail-subtitle">${s.tagline}</div>
        <div class="detail-tags">
          <span class="tag ${s.tags[0]}">${s.risk} risk</span>
          <span class="tag tag-info">${s.returns} returns</span>
          ${s.lockIn !== 'None' ? `<span class="tag tag-med">${s.lockIn} lock-in</span>` : `<span class="tag tag-low">No lock-in</span>`}
        </div>
      </div>
    </div>
 
    <div class="detail-grid">
      <div class="info-card">
        <h3>Key details</h3>
        <div class="info-row"><span>Expected returns</span><span class="green">${s.returns}</span></div>
        <div class="info-row"><span>Risk level</span><span>${s.risk}</span></div>
        <div class="info-row"><span>Lock-in period</span><span>${s.lockIn}</span></div>
        <div class="info-row"><span>Minimum investment</span><span>${s.minInvest}</span></div>
        <div class="info-row"><span>Tax benefit</span><span class="green">${s.taxBenefit}</span></div>
      </div>
      <div class="info-card">
        <h3>Pros & Cons</h3>
        ${s.proscons.pros.map(p=>`<div class="info-row"><span style="color:var(--green)">✓</span><span style="font-size:13px;color:var(--text)">${p}</span></div>`).join('')}
        ${s.proscons.cons.map(c=>`<div class="info-row"><span style="color:var(--red)">✗</span><span style="font-size:13px;color:var(--text)">${c}</span></div>`).join('')}
      </div>
    </div>
 
    <div class="explain-card">
      <h3>What is ${s.name}?</h3>
      ${s.how.split('\n').map(p=>p.trim()).filter(p=>p).map(p=>`<p>${p}</p>`).join('')}
      <div class="highlight-box"><p>${s.example}</p></div>
      ${s.works.split('\n').map(p=>p.trim()).filter(p=>p).map(p=>`<p>${p}</p>`).join('')}
    </div>
 
    <div class="calc-card" id="detail-calc">
      <h3>Calculate your returns</h3>
      <div class="calc-row">
        <div class="calc-label"><span>${s.type==='fd'?'Principal amount':'Monthly investment'}</span><span class="val" id="d-amt-v">${s.type==='fd'?'₹1,00,000':'₹5,000'}</span></div>
        <input type="range" min="${s.type==='fd'?5000:500}" max="${s.type==='fd'?1000000:50000}" step="${s.type==='fd'?5000:500}" value="${s.type==='fd'?100000:5000}" id="d-amt" oninput="updateDetail()">
      </div>
      <div class="calc-row">
        <div class="calc-label"><span>Annual interest rate</span><span class="val" id="d-rate-v">${s.rate}%</span></div>
        <input type="range" min="${s.type==='fd'?4:6}" max="${s.type==='fd'?9:20}" step="0.5" value="${s.rate}" id="d-rate" oninput="updateDetail()">
      </div>
      <div class="calc-row">
        <div class="calc-label"><span>Duration</span><span class="val" id="d-yr-v">10 years</span></div>
        <input type="range" min="1" max="30" step="1" value="10" id="d-yr" oninput="updateDetail()">
      </div>
      <div class="calc-results">
        <div class="result-box">
          <div class="result-label">${s.type==='fd'?'Principal':'Total invested'}</div>
          <div class="result-val" id="d-invested">—</div>
        </div>
        <div class="result-box">
          <div class="result-label">Final value</div>
          <div class="result-val green" id="d-final">—</div>
        </div>
        <div class="result-box">
          <div class="result-label">Profit earned</div>
          <div class="result-val green" id="d-profit">—</div>
        </div>
      </div>
      <div class="chart-legend">
        <div class="chart-legend-item"><div class="legend-dot" style="background:#2a4535"></div><span>Amount invested</span></div>
        <div class="chart-legend-item"><div class="legend-dot" style="background:#2dce7a"></div><span>Total value</span></div>
      </div>
      <div class="chart-wrap"><canvas id="detailChart" role="img" aria-label="Growth chart for ${s.name}"></canvas></div>
    </div>
  `;
 
  window._detailScheme = s;
  updateDetail();
}
function updateDetail() {
  const s = window._detailScheme;
  if (!s) return;
  const amt = parseFloat(document.getElementById('d-amt').value);
  const rate = parseFloat(document.getElementById('d-rate').value);
  const yrs = parseInt(document.getElementById('d-yr').value);
  document.getElementById('d-amt-v').textContent = s.type==='fd' ? fmtINR(amt) : fmtINR(amt)+'/mo';
  document.getElementById('d-rate-v').textContent = rate + '%';
  document.getElementById('d-yr-v').textContent = yrs + ' years';
 
  const invested = s.type === 'sip' ? amt * 12 * yrs : amt;
  const final = s.type === 'sip' ? calcSIP(amt, rate, yrs) : calcFD(amt, rate, yrs);
  const profit = final - invested;
 
  document.getElementById('d-invested').textContent = fmtINR(invested);
  document.getElementById('d-final').textContent = fmtINR(final);
  document.getElementById('d-profit').textContent = fmtINR(profit);
 
  const labels = [], inv = [], val = [];
  for (let y = 1; y <= yrs; y++) {
    labels.push('Yr'+y);
    const i = s.type==='sip' ? amt*12*y : amt;
    const v = s.type==='sip' ? calcSIP(amt,rate,y) : calcFD(amt,rate,y);
    inv.push(Math.round(i)); val.push(Math.round(v));
  }
 
  if (detailChart) detailChart.destroy();
  const ctx = document.getElementById('detailChart');
  if (!ctx) return;
  detailChart = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[
      { label:'Invested', data:inv, borderColor:'#2a4535', backgroundColor:'rgba(42,69,53,0.3)', fill:true, tension:0.4, borderDash:[5,3], pointRadius:0 },
      { label:'Value', data:val, borderColor:'#2dce7a', backgroundColor:'rgba(45,206,122,0.12)', fill:true, tension:0.4, pointRadius:0 }
    ]},
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } },
      scales:{
        y:{ ticks:{ callback:v=>fmtINR(v), color:'#4a6b52', font:{size:11,family:'JetBrains Mono'} }, grid:{ color:'#1e3025' } },
        x:{ ticks:{ color:'#4a6b52', font:{size:10}, maxTicksLimit:10 }, grid:{ color:'#1e3025' } }
      }
    }
  });
}
 
function updateDetail() {
  const s = window._detailScheme;
  if (!s) return;
  const amt = parseFloat(document.getElementById('d-amt').value);
  const rate = parseFloat(document.getElementById('d-rate').value);
  const yrs = parseInt(document.getElementById('d-yr').value);
  document.getElementById('d-amt-v').textContent = s.type==='fd' ? fmtINR(amt) : fmtINR(amt)+'/mo';
  document.getElementById('d-rate-v').textContent = rate + '%';
  document.getElementById('d-yr-v').textContent = yrs + ' years';
 
  const invested = s.type === 'sip' ? amt * 12 * yrs : amt;
  const final = s.type === 'sip' ? calcSIP(amt, rate, yrs) : calcFD(amt, rate, yrs);
  const profit = final - invested;
 
  document.getElementById('d-invested').textContent = fmtINR(invested);
  document.getElementById('d-final').textContent = fmtINR(final);
  document.getElementById('d-profit').textContent = fmtINR(profit);
 
  const labels = [], inv = [], val = [];
  for (let y = 1; y <= yrs; y++) {
    labels.push('Yr'+y);
    const i = s.type==='sip' ? amt*12*y : amt;
    const v = s.type==='sip' ? calcSIP(amt,rate,y) : calcFD(amt,rate,y);
    inv.push(Math.round(i)); val.push(Math.round(v));
  }
 
  if (detailChart) detailChart.destroy();
  const ctx = document.getElementById('detailChart');
  if (!ctx) return;
  detailChart = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[
      { label:'Invested', data:inv, borderColor:'#2a4535', backgroundColor:'rgba(42,69,53,0.3)', fill:true, tension:0.4, borderDash:[5,3], pointRadius:0 },
      { label:'Value', data:val, borderColor:'#2dce7a', backgroundColor:'rgba(45,206,122,0.12)', fill:true, tension:0.4, pointRadius:0 }
    ]},
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } },
      scales:{
        y:{ ticks:{ callback:v=>fmtINR(v), color:'#4a6b52', font:{size:11,family:'JetBrains Mono'} }, grid:{ color:'#1e3025' } },
        x:{ ticks:{ color:'#4a6b52', font:{size:10}, maxTicksLimit:10 }, grid:{ color:'#1e3025' } }
      }
    }
  });
}