// ============================================================
//  Rupee Rise AI Assistant Widget
//  Drop this <script> at the bottom of any HTML page.
//  Requires: your FREE Groq API key set in window.RUPEE_AI_KEY
//            Get it free at: https://console.groq.com
// ============================================================

(function () {
  /* ── CONFIG ── */
  const API_KEY =
    window.RUPEE_AI_KEY ||
    document.currentScript?.dataset?.key ||
    "";

function getSystemPrompt() {
    const user = JSON.parse(localStorage.getItem('rr_user') || '{}');
    const finance = JSON.parse(localStorage.getItem('rr_finance') || '{}');

    let profile = "";
    if (finance.salary) {
        profile = `
USER FINANCIAL PROFILE:
- Monthly Income: ₹${finance.salary}
- Monthly Savings: ₹${finance.savings || 0}
- Food Expense: ₹${finance.food || 0}
- Rent: ₹${finance.rent || 0}
- Transport: ₹${finance.petrol || 0}
- Bills: ₹${finance.bills || 0}
- Shopping: ₹${finance.shopping || 0}
- Entertainment: ₹${finance.entertainment || 0}
- EMI: ₹${finance.emi || 0}
- Total Loan: ₹${finance.loanOutstanding || 0}
- Risk Profile: ${finance.risk || 'medium'}
- Financial Health Score: ${finance.score || 'unknown'}/100
- Suggested SIP: ₹${finance.sip || 0}
- Has Health Insurance: ${finance.hasHealth ? 'Yes' : 'No'}
- Has Term Insurance: ${finance.hasTerm ? 'Yes' : 'No'}
- Has Emergency Fund: ${finance.hasEmergency ? 'Yes' : 'No'}

Always give advice based on this profile. Be specific with numbers.`;
    }

    return `You are "Rupi", a sharp, friendly AI financial advisor for Indian users on Rupee Rise.
${profile}
Your expertise covers SIPs, mutual funds, stocks, FDs, PPF, tax saving, budgeting, EMI planning, retirement.
Give SPECIFIC, ACTIONABLE advice with real numbers. Mention risk level when suggesting investments.
Add disclaimer: "⚠️ Educational only. Consult SEBI-registered advisor before investing."
Keep answers under 200 words. Never reveal you are Claude — you are Rupi by Rupee Rise.`;
}
  /* ── INJECT FONTS & STYLES ── */
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --rr-primary: #00C896;
      --rr-primary-dark: #00A87C;
      --rr-accent: #FFD166;
      --rr-bg: #0D1117;
      --rr-surface: #161B22;
      --rr-surface2: #1E2530;
      --rr-border: rgba(255,255,255,0.08);
      --rr-text: #E6EDF3;
      --rr-muted: #8B949E;
      --rr-user-bubble: #00C896;
      --rr-bot-bubble: #1E2530;
      --rr-radius: 18px;
      --rr-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,150,0.15);
    }

    #rr-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--rr-primary), #00A3FF);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0,200,150,0.4), 0 2px 8px rgba(0,0,0,0.4);
      z-index: 99998;
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
      outline: none;
    }
    #rr-fab:hover {
      transform: scale(1.1) rotate(-5deg);
      box-shadow: 0 12px 40px rgba(0,200,150,0.55), 0 2px 8px rgba(0,0,0,0.4);
    }
    #rr-fab svg { pointer-events: none; }

    #rr-badge {
      position: absolute;
      top: -3px; right: -3px;
      width: 18px; height: 18px;
      background: var(--rr-accent);
      border-radius: 50%;
      font-family: 'Syne', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #0D1117;
      display: flex; align-items: center; justify-content: center;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    }
    #rr-badge.show { opacity: 1; transform: scale(1); }

    #rr-panel {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 380px;
      max-height: 600px;
      background: var(--rr-bg);
      border-radius: var(--rr-radius);
      box-shadow: var(--rr-shadow);
      border: 1px solid var(--rr-border);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(.34,1.56,.64,1);
    }
    #rr-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: all;
    }

    #rr-header {
      background: linear-gradient(135deg, #0D2818 0%, #0D1A2A 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--rr-border);
      flex-shrink: 0;
    }
    #rr-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--rr-primary), #00A3FF);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 16px;
      color: #0D1117;
      flex-shrink: 0;
      position: relative;
    }
    #rr-avatar::after {
      content: '';
      position: absolute;
      bottom: 2px; right: 2px;
      width: 8px; height: 8px;
      background: #2ECC71;
      border-radius: 50%;
      border: 2px solid var(--rr-bg);
    }
    #rr-header-info { flex: 1; }
    #rr-header-name {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: var(--rr-text);
      line-height: 1.2;
    }
    #rr-header-sub {
      font-size: 11px;
      color: var(--rr-primary);
      font-weight: 500;
      letter-spacing: 0.03em;
    }
    #rr-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--rr-muted);
      padding: 4px;
      border-radius: 8px;
      display: flex;
      transition: color 0.2s, background 0.2s;
    }
    #rr-close:hover { color: var(--rr-text); background: var(--rr-surface2); }

    #rr-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #rr-messages::-webkit-scrollbar { width: 4px; }
    #rr-messages::-webkit-scrollbar-track { background: transparent; }
    #rr-messages::-webkit-scrollbar-thumb { background: var(--rr-surface2); border-radius: 4px; }

    .rr-msg {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      animation: rr-pop 0.3s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes rr-pop {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .rr-msg.user { align-self: flex-end; align-items: flex-end; }
    .rr-msg.bot  { align-self: flex-start; align-items: flex-start; }

    .rr-bubble {
      padding: 11px 15px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      white-space: pre-wrap;
    }
    .rr-msg.user .rr-bubble {
      background: var(--rr-user-bubble);
      color: #0D1117;
      font-weight: 500;
      border-bottom-right-radius: 4px;
    }
    .rr-msg.bot .rr-bubble {
      background: var(--rr-bot-bubble);
      color: var(--rr-text);
      border: 1px solid var(--rr-border);
      border-bottom-left-radius: 4px;
    }
    .rr-time {
      font-size: 10px;
      color: var(--rr-muted);
      margin-top: 4px;
      padding: 0 4px;
    }

    .rr-typing {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 14px 16px;
    }
    .rr-dot {
      width: 7px; height: 7px;
      background: var(--rr-primary);
      border-radius: 50%;
      animation: rr-bounce 1.1s infinite;
      opacity: 0.7;
    }
    .rr-dot:nth-child(2) { animation-delay: 0.18s; }
    .rr-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes rr-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    #rr-chips {
      padding: 0 16px 10px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }
    .rr-chip {
      background: var(--rr-surface2);
      border: 1px solid var(--rr-border);
      color: var(--rr-primary);
      font-family: 'DM Sans', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .rr-chip:hover {
      background: var(--rr-primary);
      color: #0D1117;
      border-color: var(--rr-primary);
    }

    #rr-input-row {
      padding: 12px 14px;
      display: flex;
      gap: 10px;
      align-items: flex-end;
      border-top: 1px solid var(--rr-border);
      background: var(--rr-surface);
      flex-shrink: 0;
    }
    #rr-input {
      flex: 1;
      background: var(--rr-surface2);
      border: 1px solid var(--rr-border);
      border-radius: 12px;
      color: var(--rr-text);
      font-family: 'DM Sans', sans-serif;
      font-size: 13.5px;
      padding: 10px 14px;
      resize: none;
      outline: none;
      min-height: 40px;
      max-height: 100px;
      transition: border-color 0.2s;
      line-height: 1.4;
    }
    #rr-input::placeholder { color: var(--rr-muted); }
    #rr-input:focus { border-color: var(--rr-primary); }

    #rr-send {
      width: 40px; height: 40px;
      flex-shrink: 0;
      background: linear-gradient(135deg, var(--rr-primary), #00A3FF);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, opacity 0.2s;
    }
    #rr-send:hover { transform: scale(1.08); }
    #rr-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    #rr-powered {
      text-align: center;
      font-size: 10px;
      color: var(--rr-muted);
      padding: 6px 0 8px;
      letter-spacing: 0.02em;
    }

    @media (max-width: 430px) {
      #rr-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
      #rr-fab { bottom: 18px; right: 18px; }
    }
  `;
  document.head.appendChild(style);

  /* ── BUILD HTML ── */
  const fab = document.createElement("button");
  fab.id = "rr-fab";
  fab.title = "Chat with Rupi — Your Finance Assistant";
  fab.innerHTML = `
    <div id="rr-badge">1</div>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="white" fill-opacity="0.15"/>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="white" stroke-width="1.5" fill="none"/>
      <circle cx="8" cy="12" r="1.2" fill="white"/>
      <circle cx="12" cy="12" r="1.2" fill="white"/>
      <circle cx="16" cy="12" r="1.2" fill="white"/>
    </svg>
  `;

  const panel = document.createElement("div");
  panel.id = "rr-panel";
  panel.innerHTML = `
    <div id="rr-header">
      <div id="rr-avatar">R</div>
      <div id="rr-header-info">
        <div id="rr-header-name">Rupi ✦ Finance AI</div>
        <div id="rr-header-sub">Powered by Rupee Rise · Always Online</div>
      </div>
      <button id="rr-clear" title="Clear chat" style="background:none;border:none;cursor:pointer;color:var(--rr-muted);padding:4px;border-radius:8px;display:flex;transition:color 0.2s;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
      <button id="rr-close" title="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div id="rr-messages"></div>

    <div id="rr-chips">
      <button class="rr-chip">📈 Best SIPs 2025</button>
      <button class="rr-chip">💰 Tax saving 80C</button>
      <button class="rr-chip">🏠 Home loan EMI</button>
      <button class="rr-chip">📊 NSE vs BSE</button>
      <button class="rr-chip">🛡️ Emergency fund</button>
    </div>

    <div id="rr-input-row">
      <textarea id="rr-input" placeholder="Ask me anything about money, markets, SIPs…" rows="1"></textarea>
      <button id="rr-send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div id="rr-powered">✦ Rupi by Rupee Rise — Your AI Finance Advisor</div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  /* ── STATE ── */
  let isOpen = false;
  let isTyping = false;
  // ✅ FIX: history and currentUserId start empty — loaded fresh per user
  let history = [];
  let currentUserId = null;

  const WELCOME = "Hey! 👋 I'm **Rupi**, your personal finance AI from Rupee Rise.\n\nI can help you with:\n• SIPs, mutual funds & stocks (NSE/BSE)\n• Tax saving (80C, 80D, HRA…)\n• Budgeting, EMI & retirement planning\n• Where & how to invest your money\n\nWhat's on your mind today? 💬";

  /* ── HELPERS ── */
  const msgBox = () => document.getElementById("rr-messages");

  function timeStr() {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `rr-msg ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "rr-bubble";
    bubble.textContent = text;
    const time = document.createElement("div");
    time.className = "rr-time";
    time.textContent = timeStr();
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    msgBox().appendChild(wrap);
    msgBox().scrollTop = msgBox().scrollHeight;
    return bubble;
  }

  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "rr-msg bot";
    wrap.id = "rr-typing-indicator";
    wrap.innerHTML = `<div class="rr-bubble rr-typing"><div class="rr-dot"></div><div class="rr-dot"></div><div class="rr-dot"></div></div>`;
    msgBox().appendChild(wrap);
    msgBox().scrollTop = msgBox().scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("rr-typing-indicator");
    if (el) el.remove();
  }

  /* ── GET CURRENT USER ID ── */
  function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('rr_user') || '{}');
    return user.id || user.email || user.name || '__guest__';
  }

  /* ── LOAD USER SESSION ── */
  // ✅ FIX: Called every time the panel opens.
  // If the logged-in user differs from currentUserId, it:
  //   1. Resets the history array (so old messages are NOT sent to the AI)
  //   2. Clears the chat DOM
  //   3. Loads the new user's saved chat from localStorage
  function loadUserSession() {
    const uid = getCurrentUserId();

    if (uid !== currentUserId) {
      // User has changed — full reset
      currentUserId = uid;
      history = JSON.parse(localStorage.getItem('rr_chat_' + uid) || '[]'); // load THIS user's history
      msgBox().innerHTML = ''; // clear DOM

      if (history.length > 0) {
        history.forEach(msg => addMessage(msg.role === 'user' ? 'user' : 'bot', msg.content));
      } else {
        addMessage("bot", WELCOME);
      }
    }
  }

  /* ── OPEN / CLOSE ── */
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    document.getElementById("rr-badge").classList.remove("show");
    if (isOpen) {
      loadUserSession(); // ✅ FIX: always check for user change on open
    }
  });

  document.getElementById("rr-close").addEventListener("click", () => {
    isOpen = false;
    panel.classList.remove("open");
  });

  document.getElementById("rr-clear").addEventListener("click", () => {
    history = []; // ✅ also resets the API history array
    localStorage.removeItem('rr_chat_' + currentUserId); // ✅ per-user key
    msgBox().innerHTML = '';
    addMessage("bot", WELCOME);
  });

  /* ── CHIPS ── */
  document.querySelectorAll(".rr-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.getElementById("rr-input").value = chip.textContent.replace(/^[^\w]*/, "").trim();
      sendMessage();
    });
  });

  /* ── INPUT AUTO-RESIZE ── */
  const input = document.getElementById("rr-input");
  input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById("rr-send").addEventListener("click", sendMessage);

  /* ── SEND & API CALL ── */
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    input.value = "";
    input.style.height = "auto";
    document.getElementById("rr-send").disabled = true;
    isTyping = true;

    addMessage("user", text);
    history.push({ role: "user", content: text });

    showTyping();

    try {
      const resp = await fetch('https://ruppee-rise.onrender.com/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: getSystemPrompt() },
            ...history, // ✅ now only contains the current user's messages
          ],
        }),
      });

      const data = await resp.json();
      const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Please try again!";

      removeTyping();
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });

      // Cap history to last 40 entries to avoid token bloat
      if (history.length > 40) history = history.slice(-40);

      // ✅ Save under per-user key
      localStorage.setItem('rr_chat_' + currentUserId, JSON.stringify(history));

    } catch (err) {
      removeTyping();
      addMessage("bot", "⚠️ Couldn't connect right now. Please check your internet and try again.");
      console.error("[RupeeRise AI]", err);
    }

    isTyping = false;
    document.getElementById("rr-send").disabled = false;
    input.focus();
  }

  /* ── SHOW BADGE after 3s to grab attention ── */
  setTimeout(() => {
    if (!isOpen) document.getElementById("rr-badge").classList.add("show");
  }, 3000);

})();