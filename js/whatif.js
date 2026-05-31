let whatifAmt = 1000;
function initWhatIf() {
  document.querySelectorAll('#whatif-btns .amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#whatif-btns .amount-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      whatifAmt = parseInt(this.dataset.amt);
      renderWhatIf();
    });
  });
  renderWhatIf();
}

function renderWhatIf() {
  const yrs = 10;
  const picks = SCHEMES.filter(s=>['sip','fd','ppf','gold','nps','elss'].includes(s.id));
  const results = picks.map(s => ({
    s, val: Math.round(calcSIP(whatifAmt, s.rate, yrs))
  })).sort((a,b)=>b.val-a.val);
  const maxVal = results[0].val;
  const colors = ['#2dce7a','#4a9eff','#f5a623','#a78bfa','#f472b6','#e84040'];
  document.getElementById('whatif-bars').innerHTML = results.map((r,i)=>`
    <div class="compare-bar-wrap" style="margin-bottom:10px">
      <div class="compare-bar-label">
        <span style="color:var(--text2);font-size:13px">${r.s.icon} ${r.s.name}</span>
        <span style="font-family:var(--mono);color:${colors[i%colors.length]};font-size:13px">${fmtINR(r.val)}</span>
      </div>
      <div class="compare-bar-track">
        <div class="compare-bar-fill" style="width:${Math.round(r.val/maxVal*100)}%;background:${colors[i%colors.length]};color:#061009;font-size:12px">
          ${r.val > maxVal*0.4 ? fmtINR(r.val) : ''}
        </div>
      </div>
    </div>
  `).join('');
}