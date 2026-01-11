function loadBasicMode() {
    fetch('views/basic.html')
        .then(res => res.text())
        .then(html => {
            appView.innerHTML = html;
            initBasicCalculator(); // Hook after DOM is ready
        });
}

function loadPortfolioMode() {
    fetch('views/portfolio.html')
        .then(res => res.text())
        .then(html => {
            appView.innerHTML = html;
            initPortfolioCalculator(); // Hook after DOM is ready
        });
}
