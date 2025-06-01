export function randomBankAccountType() {
    const types = ["CHECKING", "SAVINGS", "MORTGAGE", "CREDIT_CARD", "LINE_OF_CREDIT", "OTHER"];
    return types[Math.floor(Math.random() * types.length)];
}

export function randomBankAccountBallance() {
    return Math.floor(Math.random() * 20000000) - 10000000;
}