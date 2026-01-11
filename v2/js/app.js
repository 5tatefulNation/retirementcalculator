const appView = document.getElementById('appView');

function loadBasicMode() {
    fetch('views/basic.html')
        .then(res => res.text())
        .then(html => {
            appView.innerHTML = html;
            initBasicCalculator(); // Hook after DOM is ready
        })
        .catch(err => console.error('Failed to load basic.html:', err));
}

function loadPortfolioMode() {
    fetch('views/portfolio.html')
        .then(res => res.text())
        .then(html => {
            appView.innerHTML = html;
            initPortfolioCalculator(); // Hook after DOM is ready
        })
        .catch(err => console.error('Failed to load portfolio.html:', err));
}

// Hook mode buttons
const basicBtn = document.getElementById('basicModeBtn');
const portfolioBtn = document.getElementById('portfolioModeBtn');

basicBtn.addEventListener('click', () => {
    basicBtn.classList.add('active');
    portfolioBtn.classList.remove('active');
    loadBasicMode();
});

portfolioBtn.addEventListener('click', () => {
    if (!window.appState.hasPaid) {
        alert('Please upgrade to unlock Portfolio Mode!');
        return;
    }
    portfolioBtn.classList.add('active');
    basicBtn.classList.remove('active');
    loadPortfolioMode();
});

// Load basic mode by default
loadBasicMode();
