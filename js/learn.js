function initLearn() {
  const el = document.getElementById('learn-grid');
  if (el.children.length > 0) return;
  el.innerHTML = LEARN_TOPICS.map((t,i) => `
    <div>
      <div class="learn-card" onclick="toggleLearn(${i})">
        <span class="learn-icon">${t.icon}</span>
        <div class="learn-q">${t.q}</div>
        <div class="learn-preview">${t.preview}</div>
      </div>
      <div class="learn-detail" id="learn-detail-${i}">
        <h3>${t.q}</h3>
        ${t.answer.split('\n').map(p=>p.trim()).filter(p=>p).map(p=>`<p>${p}</p>`).join('')}
        <div class="example-box"><p><strong>Example:</strong> ${t.example}</p></div>
      </div>
    </div>
  `).join('');
}

function toggleLearn(i) {
  const el = document.getElementById('learn-detail-'+i);
  el.classList.toggle('open');
}
