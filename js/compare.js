let compareChart = null;
let activeSchemes = new Set(['sip','fd','ppf','gold']);

function initCompare() {
  const checksEl = document.getElementById('cmp-checks');
  if (checksEl.children.length > 0) { updateCompare(); return; }
  checksEl.innerHTML = SCHEMES.map(s => `
    <div class="scheme-check ${activeSchemes.has(s.id)?'active':''}" onclick="toggleScheme('${s.id}',this)" id="chk-${s.id}">
      <span>${s.icon} ${s.name}</span>
    </div>
  `).join('');
  updateCompare();
}

function toggleScheme(id, el) {
  if (activeSchemes.has(id)) {
    if (activeSchemes.size <= 2) return;
    activeSchemes.delete(id);
    el.classList.remove('active');
  } else {
    activeSchemes.add(id);
    el.classList.add('active');
  }
  updateCompare();
}

function updateCompare() {
  const amt = parseFloat(document.getElementById('cmp-amt').value);
  const yrs = parseInt(document.getElementById('cmp-yr').value);
  document.getElementById('cmp-amt-val').textContent = fmtINR(amt)+'/mo';
  document.getElementById('cmp-yr-val').textContent = yrs + ' years';

  const selected = SCHEMES.filter(s => activeSchemes.has(s.id));
  const results = selected.map(s => ({
    s, val: Math.round(calcSIP(amt, s.rate, yrs))
  })).sort((a,b) => b.val - a.val);

  const maxVal = results[0]?.val || 1;
  const invested = amt * 12 * yrs;
  const colors = ['#2dce7a','#4a9eff','#f5a623','#a78bfa','#f472b6','#e84040','#2dce7a','#4a9eff','#f5a623','#e84040'];

  document.getElementById('compare-bars-wrap').innerHTML = results.map((r,i) => `
    <div class="compare-bar-wrap">
      <div class="compare-bar-label">
        <span>${r.s.icon} ${r.s.name} (${r.s.rate}% avg)</span>
        <span>${fmtINR(r.val)}</span>
      </div>
      <div class="compare-bar-track">
        <div class="compare-bar-fill" style="width:${Math.round(r.val/maxVal*100)}%;background:${colors[i%colors.length]};color:#061009">
          ${r.val > maxVal*0.35 ? '+'+fmtINR(r.val-invested)+' profit' : ''}
        </div>
      </div>
    </div>
  `).join('');

  if (compareChart) compareChart.destroy();
  compareChart = new Chart(document.getElementById('compareChart'), {
    type:'bar',
    data:{
      labels: results.map(r=>r.s.name),
      datasets:[
        { label:'Invested', data: results.map(()=>Math.round(invested)), backgroundColor:'#1e3025' },
        { label:'Profit', data: results.map(r=>r.val-Math.round(invested)), backgroundColor: results.map((_,i)=>colors[i%colors.length]) }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+': '+fmtINR(ctx.raw) }}
      },
      scales:{
        x:{ stacked:true, ticks:{ color:'#4a6b52', font:{size:11} }, grid:{ color:'#1e3025' } },
        y:{ stacked:true, ticks:{ callback:v=>fmtINR(v), color:'#4a6b52', font:{size:11,family:'JetBrains Mono'} }, grid:{ color:'#1e3025' } }
      }
    }
  });
}