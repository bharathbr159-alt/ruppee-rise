function initRisk() {
  const el = document.getElementById('risk-grid');
  if (el.children.length > 0) return;
  const sorted = [...SCHEMES].sort((a,b) => a.riskPct - b.riskPct);
  el.innerHTML = sorted.map(s => {
    const col = s.riskPct < 30 ? '#2dce7a' : s.riskPct < 60 ? '#f5a623' : '#e84040';
    return `
      <div class="risk-card" onclick="showDetail('${s.id}')" style="cursor:pointer;transition:border-color .2s" onmouseover="this.style.borderColor='#2a4535'" onmouseout="this.style.borderColor='var(--border)'">
        <div class="risk-name">${s.icon} ${s.name}</div>
        <div class="risk-bar-wrap">
          <div class="risk-bar-bg">
            <div class="risk-bar-fill" style="width:${s.riskPct}%;background:${col}"></div>
          </div>
          <div class="risk-pct">${s.risk} risk</div>
        </div>
        <div class="risk-info"><span>Returns</span><span style="color:${col}">${s.returns}</span></div>
        <div class="risk-info"><span>Lock-in</span><span>${s.lockIn}</span></div>
      </div>
    `;
  }).join('');
}
