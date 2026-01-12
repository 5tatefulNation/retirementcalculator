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

// Mode buttons
const basicBtn = document.getElementById('basicModeBtn');
const portfolioBtn = document.getElementById('portfolioModeBtn');

basicBtn.addEventListener('click', () => {
    basicBtn.classList.add('active');
    portfolioBtn.classList.remove('active');
    loadBasicMode();
});

portfolioBtn.addEventListener('click', () => {
    if (!window.appState?.hasPaid) {
        alert('Please upgrade to unlock Portfolio Mode!');
        return;
    }
    portfolioBtn.classList.add('active');
    basicBtn.classList.remove('active');
    loadPortfolioMode();
});

// Load basic mode by default
loadBasicMode();
