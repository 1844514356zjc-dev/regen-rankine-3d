export function sumNormalizedResiduals(terms) {
    let sum = 0;
    for (const term of terms) {
        sum += Math.abs(term.actual - term.expected) / term.tolerance;
    }
    return sum;
}
//# sourceMappingURL=objective-normalization.js.map