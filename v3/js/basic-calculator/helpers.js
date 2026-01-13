export function solveForRate(P, PMT, t, FV) {
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

export function solveForYears(P, PMT, r, FV) {
    let low = 0, high = 100, tol = 0.01;

    while (high - low > tol) {
        const mid = (low + high) / 2;
        const fv = r === 0 ? P + PMT * mid : P * Math.pow(1 + r, mid) + PMT * ((Math.pow(1 + r, mid) - 1) / r);
        if (fv < FV) low = mid;
        else high = mid;
    }

    return (low + high) / 2;
}
