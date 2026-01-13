// js/portfolio-calculator.js

export function initPortfolioCalculator() {
    let accountCount = 0;

    const accountsContainer = document.getElementById('accountsContainer');
    const addAccountBtn = document.getElementById('addAccountBtn');
    const resetPortfolioBtn = document.getElementById('resetPortfolioBtn');
    const portfolioForm = document.getElementById('portfolioForm');
    const portfolioRate = document.getElementById('portfolioRate');
    const portfolioYears = document.getElementById('portfolioYears');
    const portfolioTotal = document.getElementById('portfolioTotal');
    const portfolioTotalValue = document.getElementById('portfolioTotalValue');

    if (!portfolioForm) return;

    function addAccount() {
        accountCount++;
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account-section';
        accountDiv.dataset.accountId = accountCount;

        accountDiv.innerHTML = `
            <div class="account-header">
                <h3>Account ${accountCount}</h3>
                <button type="button" class="remove-account" data-account-id="${accountCount}">Remove</button>
            </div>
            <div class="account-inputs">
                <div class="form-group">
                    <label>Principal ($)</label>
                    <input type="number" class="account-principal" step="0.01">
                </div>
                <div class="form-group">
                    <label>Annual Contribution ($)</label>
                    <input type="number" class="account-contribution" step="0.01">
                </div>
            </div>
            <div class="account-result hidden">
                <div class="account-result-label">Future Value</div>
                <div class="account-result-value">—</div>
            </div>
        `;

        accountsContainer.appendChild(accountDiv);
        updateRemoveButtons();
    }

    function updateRemoveButtons() {
        const accounts = document.querySelectorAll('.account-section');
        const removeButtons = document.querySelectorAll('.remove-account');
        if (accounts.length <= 2) removeButtons.forEach(btn => btn.classList.add('hidden'));
        else removeButtons.forEach(btn => btn.classList.remove('hidden'));
    }

    accountsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-account')) {
            const accountId = e.target.dataset.accountId;
            const account = document.querySelector(`[data-account-id="${accountId}"]`);
            if (account) account.remove();
            updateRemoveButtons();
        }
    });

    addAccountBtn.addEventListener('click', addAccount);

    resetPortfolioBtn.addEventListener('click', () => {
        accountsContainer.innerHTML = '';
        accountCount = 0;
        portfolioForm.reset();
        portfolioTotal.classList.add('hidden');
        addAccount();
        addAccount(); // Always start with 2 accounts
    });

    portfolioForm.addEventListener('submit', e => {
        e.preventDefault();
        calculatePortfolio();
    });

    function calculatePortfolio() {
        const accounts = document.querySelectorAll('.account-section');
        const r = (parseFloat(portfolioRate.value) || 0) / 100;
        const t = parseFloat(portfolioYears.value) || 0;
        let totalFV = 0;

        accounts.forEach(account => {
            const P = parseFloat(account.querySelector('.account-principal').value) || 0;
            const PMT = parseFloat(account.querySelector('.account-contribution').value) || 0;

            const fv = r === 0 ? P + PMT * t : P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);

            const resultContainer = account.querySelector('.account-result');
            const resultValue = account.querySelector('.account-result-value');
            resultValue.textContent = '$' + fv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            resultContainer.classList.remove('hidden');

            totalFV += fv;
        });

        portfolioTotalValue.textContent = '$' + totalFV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        portfolioTotal.classList.remove('hidden');
    }

    // Initialize with 2 default accounts
    addAccount();
    addAccount();
}
