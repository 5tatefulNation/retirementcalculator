// js/basic-calculator/index.js
import { calculateResult } from './math.js';

export function initBasicCalculator() {
    const basicForm = document.getElementById('basicForm');
    const solveFor = document.getElementById('solveFor');
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

    // Show/hide inputs depending on dropdown
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

    // Calculate and display result
    function calculate() {
        const P = parseFloat(principal.value) || 0;
        const PMT = parseFloat(contribution.value) || 0;
        const t = parseFloat(years.value) || 0;
        const r = (parseFloat(rate.value) || 0) / 100;
        const FV = parseFloat(targetFV.value) || 0;

        const solving = solveFor.value;
        const resultVal = calculateResult({ solving, P, PMT, t, r, FV });

        if (solving === 'rate') resultValue.textContent = resultVal.toFixed(2) + '%';
        else if (solving === 'years') resultValue.textContent = resultVal.toFixed(1) + ' years';
        else resultValue.textContent = '$' + resultVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- Critical wiring ---
    solveFor.addEventListener('change', updateInputStates);

    basicForm.addEventListener('submit', e => {
        e.preventDefault();       // THIS prevents the form from reloading the page
        calculate();
    });

    // Set initial input states
    updateInputStates();
}
