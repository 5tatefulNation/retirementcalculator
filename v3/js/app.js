const appView = document.getElementById('appView');

// Load Basic Mode dynamically
function loadBasicMode() {
    fetch('views/basic.html')
        .then(res => res.text())
        .then(async html => {
            appView.innerHTML = html;

            // Import the modular init function after injection
            const module = await import('./basic-calculator/index.js');
            module.initBasicCalculator();
        })
        .catch(err => console.error('Failed to load basic.html:', err));
}

// Load Portfolio Mode dynamically
function loadPortfolioMode() {
    fetch('views/portfolio.html')
        .then(res => res.text())
        .then(async html => {
            appView.innerHTML = html;

            // Import the modular init function for Portfolio Mode
            const module = await import('./portfolio-calculator.js');
            module.initPortfolioCalculator();
        })
        .catch(err => console.error('Failed to load portfolio.html:', err));
}

function loadUpgradeView() {
    fetch('views/upgrade.html')
        .then(res => res.text())
        .then(html => (appView.innerHTML = html))
        .catch(err => console.error('Failed to load upgrade.html:', err));
}

// UI helpers
function updateModeUI() {
    if (window.appState.hasPaid) {
        portfolioBtn.classList.remove('locked');
    } else {
        portfolioBtn.classList.add('locked');
    }
}

window.app = {
    updateModeUI,
};

// Mode buttons
const basicBtn = document.getElementById('basicModeBtn');
const portfolioBtn = document.getElementById('portfolioModeBtn');

function setActiveButton(activeBtn) {
    [basicBtn, portfolioBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

basicBtn.addEventListener('click', () => {
    setActiveButton(basicBtn);
    loadBasicMode();
});

portfolioBtn.addEventListener('click', () => {
    if (!window.appState?.hasPaid) {
        loadUpgradeView();
        return;
    }
    setActiveButton(portfolioBtn);
    loadPortfolioMode();
});

// Initial Load
window.app.updateModeUI();
loadBasicMode();
setActiveButton(basicBtn);
