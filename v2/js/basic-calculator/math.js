// js/basic-calculator/math.js
export function calculateResult({ solving, P, PMT, t, r, FV }) {
    if (solving === 'futureValue') {
        return r === 0
            ? P + PMT * t
            : P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
    } else if (solving === 'principal') {
        return r === 0
            ? FV - PMT * t
            : (FV - PMT * ((Math.pow(1 + r, t) - 1) / r)) / Math.pow(1 + r, t);
    } else if (solving === 'contribution') {
        return r === 0
            ? (FV - P) / t
            : (FV - P * Math.pow(1 + r, t)) * r / (Math.pow(1 + r, t) - 1);
    } else if (solving === 'rate') {
        return solveForRate(P, PMT, t, FV);
    } else if (solving === 'years') {
        return solveForYears(P, PMT, r, FV);
    }
}

function solveForRate(P, PMT, t, FV) {
    let rate = 0.07;
    const tol = 0.00001;
    const maxIter = 100;

    for (let i = 0; i < maxIter; i++) {
        const fv = P * Math.pow(1 + rate, t) + PMT * ((Math.pow(1 + rate, t) - 1) / rate);
        const error = fv - FV;
        if (Math.abs(error) < tol) break;

        const dr = 0.0001;
        const fv2 = P * Math.pow(1 + rate + dr, t) + PMT * ((Math.pow(1 + rate + dr, t) - 1) / (rate + dr));
        rate = rate - (fv2 - fv) / dr;
    }

    return rate * 100;
}

function solveForYears(P, PMT, r, FV) {
    // Robust bisection method
    let low = 0;
    let high = 100;
    const tol = 0.01;

    while (high - low > tol) {
        const mid = (low + high) / 2;

        let fv;
        if (r === 0) {
            fv = P + PMT * mid;
        } else if (PMT === 0) {
            fv = P * Math.pow(1 + r, mid);
        } else {
            fv = P * Math.pow(1 + r, mid) + PMT * ((Math.pow(1 + r, mid) - 1) / r);
        }

        if (fv < FV) low = mid;
        else high = mid;
    }

    return (low + high) / 2;
}
// js/basic-calculator/math.js
export function calculateResult({ solving, P, PMT, t, r, FV }) {
    if (solving === 'futureValue') {
        return r === 0
            ? P + PMT * t
            : P * Math.pow(1 + r, t) + PMT * ((Math.pow(1 + r, t) - 1) / r);
    } else if (solving === 'principal') {
        return r === 0
            ? FV - PMT * t
            : (FV - PMT * ((Math.pow(1 + r, t) - 1) / r)) / Math.pow(1 + r, t);
    } else if (solving === 'contribution') {
        return r === 0
            ? (FV - P) / t
            : (FV - P * Math.pow(1 + r, t)) * r / (Math.pow(1 + r, t) - 1);
    } else if (solving === 'rate') {
        return solveForRate(P, PMT, t, FV);
    } else if (solving === 'years') {
        return solveForYears(P, PMT, r, FV);
    }
}

function solveForRate(P, PMT, t, FV) {
    let rate = 0.07;
    const tol = 0.00001;
    const maxIter = 100;

    for (let i = 0; i < maxIter; i++) {
        const fv = P * Math.pow(1 + rate, t) + PMT * ((Math.pow(1 + rate, t) - 1) / rate);
        const error = fv - FV;
        if (Math.abs(error) < tol) break;

        const dr = 0.0001;
        const fv2 = P * Math.pow(1 + rate + dr, t) + PMT * ((Math.pow(1 + rate + dr, t) - 1) / (rate + dr));
        rate = rate - (fv2 - fv) / dr;
    }

    return rate * 100;
}

function solveForYears(P, PMT, r, FV) {
    // Robust bisection method
    let low = 0;
    let high = 100;
    const tol = 0.01;

    while (high - low > tol) {
        const mid = (low + high) / 2;

        let fv;
        if (r === 0) {
            fv = P + PMT * mid;
        } else if (PMT === 0) {
            fv = P * Math.pow(1 + r, mid);
        } else {
            fv = P * Math.pow(1 + r, mid) + PMT * ((Math.pow(1 + r, mid) - 1) / r);
        }

        if (fv < FV) low = mid;
        else high = mid;
    }

    return (low + high) / 2;
}
