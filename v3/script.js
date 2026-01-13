// App Controller
(function () {
    const appView = document.getElementById('appView');
    const basicModeBtn = document.getElementById('basicModeBtn');
    const portfolioModeBtn = document.getElementById('portfolioModeBtn');

    // Initial load
    loadBasicMode();
    updateModeUI();

    // Event listeners
    basicModeBtn.addEventListener('click', () => {
        setActiveButton(basicModeBtn);
        loadBasicMode();
    });

    // View loaders
    function loadBasicMode() {
        fetch('views/basic.html')
            .then(res => res.text())
            .then(html => {
                appView.innerHTML = html;
            });
    }

    function loadPortfolioMode() {
        fetch('views/portfolio.html')
            .then(res => res.text())
            .then(html => {
                appView.innerHTML = html;
            });
    }

    function loadUpgradeView() {
        fetch('views/upgrade.html')
            .then(res => res.text())
            .then(html => {
                appView.innerHTML = html;
            });
    }

    // UI helpers
    function updateModeUI() {
        if (window.appState.hasPaid) {
            portfolioModeBtn.classList.remove('locked');
        } else {
            portfolioModeBtn.classList.add('locked');
        }
    }

    function setActiveButton(activeBtn) {
        [basicModeBtn, portfolioModeBtn].forEach(btn =>
            btn.classList.remove('active')
        );
        activeBtn.classList.add('active');
    }
    window.app = {
        updateModeUI,
    };
})();
