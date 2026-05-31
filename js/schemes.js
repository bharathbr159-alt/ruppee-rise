// ===== RENDER SCHEME CARDS =====

function renderSchemeGrid(el, schemes) {

  el.innerHTML = schemes.map(s => `

    <div class="scheme-card"
         style="--card-accent:${s.accent}"
         onclick="showDetail('${s.id}')">

      <div class="scheme-icon">${s.icon}</div>

      <div class="scheme-name">
        ${s.name}

        <span style="color:var(--text3);font-size:12px;font-weight:400">
          — ${s.fullName}
        </span>
      </div>

      <div class="scheme-tagline">
        ${s.tagline}
      </div>

      <div class="scheme-meta">

        <span class="tag ${s.tags[0]}">
          ${s.risk} risk
        </span>

        <span class="tag tag-info">
          ${s.returns}
        </span>

      </div>

    </div>

  `).join('');
}