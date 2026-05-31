// ── RUPEE RISE UI ENHANCEMENTS ──
// Loading animations, hover effects, mobile menu, dark/light mode

(function() {

// ══════════════════════════════════════
// 1. PAGE LOAD ANIMATION
// ══════════════════════════════════════
const loadStyle = document.createElement('style');
loadStyle.textContent = `
  /* Page fade in */
  body { animation: bodyFade 0.4s ease; }
  @keyframes bodyFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* Skeleton loader */
  .loading-pulse {
    background: linear-gradient(90deg, #1a221a 25%, #243024 50%, #1a221a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ══════════════════════════════════════
     2. HOVER EFFECTS
  ══════════════════════════════════════ */

  /* Scheme cards */
  .scheme-card {
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), 
                box-shadow 0.25s ease,
                border-color 0.2s ease !important;
  }
  .scheme-card:hover {
    transform: translateY(-6px) scale(1.01) !important;
    box-shadow: 0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(45,206,122,0.2) !important;
  }

  /* Feature cards */
  .feature-card {
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                box-shadow 0.25s ease,
                border-color 0.25s ease !important;
  }
  .feature-card:hover {
    transform: translateY(-8px) !important;
    border-color: #00C896 !important;
    box-shadow: 0 20px 50px rgba(0,200,150,0.12) !important;
  }

  /* Learn cards */
  .learn-card {
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease !important;
  }
  .learn-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 30px rgba(0,0,0,0.25) !important;
  }

  /* Nav links */
  .nav-links a {
    position: relative;
    transition: color 0.2s !important;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: #00C896;
    transition: width 0.25s ease;
    border-radius: 2px;
  }
  .nav-links a:hover::after { width: 100%; }

  /* Buttons */
  .btn-primary, .btn-secondary {
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), 
                box-shadow 0.2s ease,
                background 0.2s ease !important;
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 24px rgba(45,206,122,0.35) !important;
  }
  .btn-secondary:hover {
    transform: translateY(-2px) !important;
  }

  /* Risk cards */
  .risk-card {
    transition: transform 0.2s ease, border-color 0.2s ease !important;
  }
  .risk-card:hover {
    transform: translateY(-3px) !important;
    border-color: rgba(45,206,122,0.3) !important;
  }

  /* ══════════════════════════════════════
     3. MOBILE MENU
  ══════════════════════════════════════ */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    border: none;
    background: none;
  }
  .hamburger span {
    width: 24px; height: 2px;
    background: #e8f5e8;
    border-radius: 2px;
    transition: all 0.3s ease;
    display: block;
  }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  @media (max-width: 768px) {
    .hamburger { display: flex; }

    .nav-links {
      position: fixed;
      top: 60px; left: 0; right: 0;
      background: rgba(10,15,13,0.98);
      backdrop-filter: blur(20px);
      flex-direction: column;
      padding: 20px 24px;
      gap: 0;
      border-bottom: 1px solid rgba(0,200,150,0.15);
      transform: translateY(-10px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 99;
    }
    .nav-links.mobile-open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .nav-links a {
      padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 15px !important;
    }
    .nav-links a:last-child { border-bottom: none; }
    .nav-links a::after { display: none; }

    /* Mobile hero */
    .hero { padding: 40px 1rem 30px !important; }
    .hero h1 { font-size: 2rem !important; }
    .hero p { font-size: 15px !important; }
    .stats-row { flex-direction: column; gap: 0; }
    .stat-item { border-right: none !important; border-bottom: 1px solid var(--border); }
    .stat-item:last-child { border-bottom: none; }

    /* Mobile grids */
    .scheme-grid { grid-template-columns: 1fr 1fr !important; }
    .learn-grid { grid-template-columns: 1fr !important; }
    .risk-grid { grid-template-columns: 1fr 1fr !important; }
    .detail-grid { grid-template-columns: 1fr !important; }
    .calc-results { grid-template-columns: 1fr 1fr !important; }
    .compare-controls { padding: 1rem !important; }
    .section { padding: 1.5rem 1rem !important; }
    .whatif-card { padding: 1.2rem !important; }
    .whatif-amounts { gap: 6px; }
    .amount-btn { font-size: 12px !important; padding: 5px 10px !important; }
  }

  @media (max-width: 480px) {
    .scheme-grid { grid-template-columns: 1fr !important; }
    .risk-grid { grid-template-columns: 1fr !important; }
    .hero h1 { font-size: 1.7rem !important; }
    .btn-primary, .btn-secondary { width: 100%; margin: 4px 0 !important; display: block; }
  }

  /* ══════════════════════════════════════
     5. LOADING SPINNER for AI responses
  ══════════════════════════════════════ */
  .rr-spinner {
    display: inline-flex; gap: 4px; align-items: center; padding: 4px 0;
  }
  .rr-spinner span {
    width: 6px; height: 6px; background: #00C896;
    border-radius: 50%; animation: rr-spin 1s infinite;
  }
  .rr-spinner span:nth-child(2) { animation-delay: 0.15s; }
  .rr-spinner span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes rr-spin {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* ══════════════════════════════════════
     6. TOAST NOTIFICATIONS
  ══════════════════════════════════════ */
  #rr-toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #111811; border: 1px solid rgba(0,200,150,0.3);
    color: #e8f5e8; padding: 12px 24px; border-radius: 12px;
    font-size: 13px; font-family: 'Sora', sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    opacity: 0; transition: all 0.3s ease; z-index: 99999;
    pointer-events: none; white-space: nowrap;
  }
  #rr-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;
document.head.appendChild(loadStyle);

// ══════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════
function initHamburger() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('aria-label', 'Menu');
    nav.appendChild(hamburger);

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('mobile-open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        });
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!nav.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        }
    });
}



// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    function observeCards() {
        document.querySelectorAll('.scheme-card, .learn-card, .risk-card, .feature-card, .stat-item').forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                observer.observe(el);
            }
        });
    }

    observeCards();
    // Re-observe when pages change
    const pageObserver = new MutationObserver(observeCards);
    pageObserver.observe(document.body, { childList: true, subtree: true });
}

// ══════════════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════════════
function showToast(msg, duration = 2500) {
    let toast = document.getElementById('rr-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'rr-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// Make showToast globally available
window.showToast = showToast;

// ══════════════════════════════════════
// INIT ALL
// ══════════════════════════════════════
function init() {
    initHamburger();
    // initThemeToggle(); // Commented out as theme toggle is removed
    initScrollReveal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();