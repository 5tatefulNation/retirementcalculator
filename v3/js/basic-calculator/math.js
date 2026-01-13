// js/basic-calculator/math.js

export function calculateResult({ solving, P, PMT, t, r, FV }) {
    switch (solving) {
        case 'futureValue':
            return calculateFutureValue(P, PMT, r, t);

        case 'principal':
            return calculatePrincipal(FV, PMT, r, t);

        case 'contribution':
            return calculateContribution(FV, P, r, t);

        case 'rate':
            return solveForRate(P, PMT, t, FV);

        case 'years':
            return solveForYears(P, PMT, r, FV);

        default:
            return 0;
    }
}

/* ======================
   Core Calculations
====================== */

function calculateFutureValue(P, PMT, r, t) {
    if (r === 0) return P + PMT * t;
    return P * Math.pow(1 + r, t) +
           PMT * ((Math.pow(1 + r, t) - 1) / r);
}

function calculatePrincipal(FV, PMT, r, t) {
    if (r === 0) return FV - PMT * t;
    return (FV - PMT * ((Math.pow(1 + r, t) - 1) / r)) /
           Math.pow(1 + r, t);
}

function calculateContribution(FV, P, r, t) {
    if (r === 0) return (FV - P) / t;
    return (FV - P * Math.pow(1 + r, t)) *
           r / (Math.pow(1 + r, t) - 1);
}

/* ======================
   Solvers
====================== */

function solveForRate(P, PMT, t, FV) {
    let r = 0.07;               // initial guess
    const tolerance = 1e-6;
    const maxIterations = 200;

    for (let i = 0; i < maxIterations; i++) {
        const fv =
            P * Math.pow(1 + r, t) +
            PMT * ((Math.pow(1 + r, t) - 1) / r);

        const error = fv - FV;
        if (Math.abs(error) < tolerance) break;

        const dr = 1e-5;
        const fv2 =
            P * Math.pow(1 + r + dr, t) +
            PMT * ((Math.pow(1 + r + dr, t) - 1) / (r + dr));

        const derivative = (fv2 - fv) / dr;
        r -= error / derivative;
    }

    return r * 100;
}

function solveForYears(P, PMT, r, FV) {
    let low = 0;
    let high = 100;
    const tolerance = 0.01;

    while (high - low > tolerance) {
        const mid = (low + high) / 2;

        const fv =
            r === 0
                ? P + PMT * mid
                : P * Math.pow(1 + r, mid) +
                  PMT * ((Math.pow(1 + r, mid) - 1) / r);

        if (fv < FV) low = mid;
        else high = mid;
    }

    return (low + high) / 2;
}
