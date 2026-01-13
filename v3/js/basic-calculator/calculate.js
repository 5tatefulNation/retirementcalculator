import { displayResult } from './dom.js';
import { solveFutureValue, solvePrincipal, solveContribution, solveForRate, solveForYears } from './math.js';

export function calculate(solveForEl) {
    const solving = solveForEl.value;
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('contribution').value) || 0;
    const t = parseFloat(document.getElementById('years').value) || 0;
    const r = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const FV = parseFloat(document.getElementById('targetFV').value) || 0;

    let resultVal;

    switch (solving) {
        case 'futureValue':
            resultVal = solveFutureValue(P, PMT, r, t);
            break;
        case 'principal':
            resultVal = solvePrincipal(PMT, r, t, FV);
            break;
        case 'contribution':
            resultVal = solveContribution(P, r, t, FV);
            break;
        case 'rate':
            resultVal = solveForRate(P, PMT, t, FV);
            break;
        case 'years':
            resultVal = PMT === 0 && r !== 0 ? Math.log(FV / P) / Math.log(1 + r) : solveForYears(P, PMT, r, FV);
            break;
    }

    displayResult(resultVal, solving);
}
