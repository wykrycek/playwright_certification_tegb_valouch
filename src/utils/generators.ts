export function randomBankAccountType() {
    const types = ["CHECKING", "SAVINGS", "MORTGAGE", "CREDIT_CARD", "LINE_OF_CREDIT", "OTHER"];
    return types[Math.floor(Math.random() * types.length)];
}

export function randomBankAccountBallance() { // Náhodné číslo mezi -1000 a 1000
    return Math.floor(Math.random() * 2000) - 1000;
}