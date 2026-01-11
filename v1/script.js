// Check if user has paid
let hasPaid = localStorage.getItem('has_paid') === 'true';

// Mode switching
const basicModeBtn = document.getElementById('basicModeBtn');
const portfolioModeBtn = document.getElementById('portfolioModeBtn');
const basicMode = document.getElementById('basicMode');
const portfolioMode = document.getElementById('portfolioMode');
const upgradeSection = document.getElementById('upgradeSection');

function updateModeUI() {
    if (hasPaid) {
        portfolioModeBtn.classList.remove('locked');
        upgradeSection.classList.add('hidden');
    } else {
        portfolioModeBtn.classList.add('locked');
    }
}

basicModeBtn.addEventListener('click', () => {
    basicModeBtn.classList.add('active');
    portfolioModeBtn.classList.remove('active');
    basicMode.classList.remove('hidden');
    portfolioMode.classList.add('hidden');
});

portfolioModeBtn.addEventListener('click', () => {
    if (!hasPaid) {
        alert('Please upgrade to unlock Portfolio Mode!');
        return;
    }
    portfolioModeBtn.classList.add('active');
    basicModeBtn.classList.remove('active');
    portfolioMode.classList.remove('hidden');
    basicMode.classList.add('hidden');
});

// Stripe integration (mock for now - replace with your Stripe publishable key)
document.getElementById('upgradeBtn').addEventListener('click', () => {
    // In production, redirect to Stripe Checkout
    // For demo purposes, we'll simulate payment
    const confirmPayment = confirm('This will redirect to Stripe for payment ($5). For demo purposes, clicking OK will unlock Portfolio Mode.');
    if (confirmPayment) {
        localStorage.setItem('has_paid', 'true');
        hasPaid = true;
        updateModeUI();
        alert('Payment successful! Portfolio Mode unlocked.');
        
        // In production, you'd do:
        // window.location.href = 'https://checkout.stripe.com/pay/your_payment_link';
    }
});

// Check for Stripe success redirect
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === 'true') {
    localStorage.setItem('has_paid', 'true');
    hasPaid = true;
    updateModeUI();
    alert('Payment successful! Portfolio Mode unlocked.');
}

// Basic Mode Calculator
const solveFor = document.getElementById('solveFor');
const basicForm = document.getElementById('basicForm');
const principal = document.getElementById('principal');
const contribution = document.getElementById('contribution');
const years = document.getElementById('years');
const rate = document.getElementById('rate');
const targetFV = document.getElementById('targetFV');
const result = document.getElementById('result');
const resultValue = document.getElementById('resultValue');

const inputGroups = {
    principal: document.getElementById('principalGroup'),
    contribution: document.getElementById('contributionGroup'),
    years: document.getElementById('yearsGroup'),
    rate: document.getElementById('rateGroup'),
    targetFV: document.getElementById('targetFVGroup')
};

solveFor.addEventListener('change', updateInputStates);

function updateInputStates() {
    const solving = solveFor.value;
    
    // Show all input groups by default
    Object.values(inputGroups).forEach(group => {
        group.classList.remove('hidden');
    });
    
    // Hide the one we're solving for
    if (solving === 'futureValue') {
        inputGroups.targetFV.classList.add('hidden');
    } else {
        inputGroups[solving].classList.add('hidden');
        inputGroups.targetFV.classList.remove('hidden');
    }
    
    // Reset value to placeholder
    resultValue.textContent = '—';
}

basicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculate();
});

function calculate() {
    const solving = solveFor.value;
    const P = parseFloat(principal.value) || 0;
    const PMT = parseFloat(contribution.value) || 0;
    const t = parseFloat(years.value) || 0;
    const r = (parseFloat(rate.value) || 0) / 100;
    const FV = parseFloat(targetFV.value) || 0;
    
    let resultVal;
    let label;
    
    if (solving === 'futureValue') {
        // FV = P(1 + r)^t + PMT × [((1 + r)^t - 1) / r]
        if (r === 0) {
            resultVal = P + PMT * t;
        } else {
            resultVal = P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
        }
        label = 'Future Value';
    } else if (solving === 'principal') {
        // P = (FV - PMT × [((1 + r)^t - 1) / r]) / (1 + r)^t
        if (r === 0) {
            resultVal = FV - PMT * t;
        } else {
            resultVal = (FV - PMT * ((Math.pow(1 + r, t) - 1) / r)) / Math.pow(1 + r, t);
        }
        label = 'Required Principal';
    } else if (solving === 'contribution') {
        // PMT = (FV - P(1 + r)^t) × r / ((1 + r)^t - 1)
        if (r === 0) {
            resultVal = (FV - P) / t;
        } else {
            resultVal = (FV - P * Math.pow(1 + r, t)) * r / (Math.pow(1 + r, t) - 1);
        }
        label = 'Required Annual Contribution';
    } else if (solving === 'rate') {
        // Use Newton's method to solve for r
        resultVal = solveForRate(P, PMT, t, FV);
        label = 'Required Interest Rate';
    } else if (solving === 'years') {
        // Solve for t using logarithms (simplified for P only, complex with PMT)
        if (PMT === 0 && r !== 0) {
            resultVal = Math.log(FV / P) / Math.log(1 + r);
        } else {
            // Use binary search for complex case
            resultVal = solveForYears(P, PMT, r, FV);
        }
        label = 'Required Years';
    }
    
    displayResult(label, resultVal, solving);
}

function solveForRate(P, PMT, t, FV) {
    // Newton's method to solve for interest rate
    let r = 0.07; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
        const fv = P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
        const error = fv - FV;
        
        if (Math.abs(error) < tolerance) break;
        
        // Derivative approximation
        const dr = 0.0001;
        const fv2 = P * Math.pow(1 + r + dr, t) + PMT * ((Math.pow(1 + r + dr, t) - 1) / (r + dr));
        const derivative = (fv2 - fv) / dr;
        
        r = r - error / derivative;
    }
    
    return r * 100; // Convert to percentage
}

function solveForYears(P, PMT, r, FV) {
    // Binary search to solve for years
    let low = 0;
    let high = 100;
    const tolerance = 0.01;
    
    while (high - low > tolerance) {
        const mid = (low + high) / 2;
        const fv = r === 0 
            ? P + PMT * mid 
            : P * Math.pow(1 + r, mid) + PMT * ((Math.pow(1 + r, mid) - 1) / r);
        
        if (fv < FV) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return (low + high) / 2;
}

function displayResult(label, value, type) {
    if (type === 'rate') {
        resultValue.textContent = value.toFixed(2) + '%';
    } else if (type === 'years') {
        resultValue.textContent = value.toFixed(1) + ' years';
    } else {
        resultValue.textContent = '$' + value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Portfolio Mode
let accountCount = 0;
const accountsContainer = document.getElementById('accountsContainer');
const addAccountBtn = document.getElementById('addAccountBtn');
const portfolioForm = document.getElementById('portfolioForm');
const portfolioTotal = document.getElementById('portfolioTotal');
const portfolioTotalValue = document.getElementById('portfolioTotalValue');
const portfolioRate = document.getElementById('portfolioRate');
const portfolioYears = document.getElementById('portfolioYears');

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
    
    if (accounts.length <= 1) {
        removeButtons.forEach(btn => btn.classList.add('hidden'));
    } else {
        removeButtons.forEach(btn => btn.classList.remove('hidden'));
    }
}

accountsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-account')) {
        const accountId = e.target.dataset.accountId;
        const account = document.querySelector(`[data-account-id="${accountId}"]`);
        if (account) {
            account.remove();
            updateRemoveButtons();
        }
    }
});

addAccountBtn.addEventListener('click', addAccount);

portfolioForm.addEventListener('submit', (e) => {
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
        
        let fv;
        if (r === 0) {
            fv = P + PMT * t;
        } else {
            fv = P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
        }
        
        // Update individual account result
        const resultContainer = account.querySelector('.account-result');
        const resultValue = account.querySelector('.account-result-value');
        resultValue.textContent = '$' + fv.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        resultContainer.classList.remove('hidden');
        
        totalFV += fv;
    });
    
    portfolioTotalValue.textContent = '$' + totalFV.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    portfolioTotal.classList.remove('hidden');
}

// Initialize
updateModeUI();
updateInputStates();
addAccount(); // Add first account by default