// ===== INIT =====
const homeGrid = document.getElementById('home-scheme-grid');
const allGrid = document.getElementById('all-scheme-grid');
renderSchemeGrid(homeGrid, SCHEMES.slice(0,6));
renderSchemeGrid(allGrid, SCHEMES);
initWhatIf();
