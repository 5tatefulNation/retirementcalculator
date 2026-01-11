// Basic Mode Calculator — wrap everything in a function
function initBasicCalculator() {
    const solveFor = document.getElementById('solveFor');
    const basicForm = document.getElementById('basicForm');
    const principal = document.getElementById('principal');
    const contribution = document.getElementById('contribution');
    const years = document.getElementById('years');
    const rate = document.getElementById('rate');
    const targetFV = document.getElementById('targetFV');
    const resultValue = document.getElementById('resultValue');

    if (!basicForm) return;

    const inputGroups = {
        principal: document.getElementById('principalGroup'),
        contribution: document.getElementById('contributionGroup'),
        years: document.getElementById('yearsGroup'),
        rate: document.getElementById('rateGroup'),
        targetFV: document.getElementById('targetFVGroup')
    };

    solveFor.addEventListener('change', updateInputStates);

    basicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculate();
    });

    updateInputStates();

    function updateInputStates() {
        const solving = solveFor.value;
        Object.values(inputGroups).forEach(group => group.classList.remove('hidden'));

        if (solving === 'futureValue') {
            inputGroups.targetFV.classList.add('hidden');
        } else {
            inputGroups[solving].classList.add('hidden');
            inputGroups.targetFV.classList.remove('hidden');
        }

        resultValue.textContent = '—';
    }

    function calculate() {
        const solving = solveFor.value;
        const P = parseFloat(principal.value) || 0;
        const PMT = parseFloat(contribution.value) || 0;
        const t = parseFloat(years.value) || 0;
        const r = (parseFloat(rate.value) || 0) / 100;
        const FV = parseFloat(targetFV.value) || 0;

        let resultVal;

        if (solving === 'futureValue') {
            resultVal = r === 0 ? P + PMT * t : P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
        } else if (solving === 'principal') {
            resultVal = r === 0 ? FV - PMT * t : (FV - PMT * ((Math.pow(1 + r, t) - 1) / r)) / Math.pow(1 + r, t);
        } else if (solving === 'contribution') {
            resultVal = r === 0 ? (FV - P) / t : (FV - P * Math.pow(1 + r, t)) * r / (Math.pow(1 + r, t) - 1);
        } else if (solving === 'rate') {
            resultVal = solveForRate(P, PMT, t, FV);
        } else if (solving === 'years') {
            resultVal = PMT === 0 && r !== 0 ? Math.log(FV / P) / Math.log(1 + r) : solveForYears(P, PMT, r, FV);
        }

        displayResult(resultVal, solving);
    }

    function solveForRate(P, PMT, t, FV) {
        let r = 0.07;
        const tol = 0.0001;
        const maxIter = 100;

        for (let i = 0; i < maxIter; i++) {
            const fv = P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
            const error = fv - FV;
            if (Math.abs(error) < tol) break;

            const dr = 0.0001;
            const fv2 = P * Math.pow(1 + r + dr, t) + PMT * ((Math.pow(1 + r + dr, t) - 1) / (r + dr));
            r = r - (fv2 - fv) / dr;
        }

        return r * 100;
    }

    function solveForYears(P, PMT, r, FV) {
        let low = 0, high = 100, tol = 0.01;

        while (high - low > tol) {
            const mid = (low + high) / 2;
            const fv = r === 0 ? P + PMT * mid : P * Math.pow(1 + r, mid) + PMT * ((Math.pow(1 + r, mid) - 1) / r);
            if (fv < FV) low = mid;
            else high = mid;
        }

        return (low + high) / 2;
    }

    function displayResult(value, type) {
        if (type === 'rate') resultValue.textContent = value.toFixed(2) + '%';
        else if (type === 'years') resultValue.textContent = value.toFixed(1) + ' years';
        else resultValue.textContent = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
