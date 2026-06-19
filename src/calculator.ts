export const CARD_PERCENT_RATE = 0.026;
export const CARD_FIXED_FEE = 0.15;
export const BITCOIN_2027_RATE = 0.01;
export const BITCOIN_TRANSACTION_CAP = 600;

export type FeeResult = {
  ticket: number;
  cardFee: number;
  bitcoinFeeNow: number;
  bitcoinFeeLater: number;
  saveNow: number;
  saveLater: number;
};

export type HorizonResult = {
  months: number;
  monthsThrough2026: number;
  monthsAfter2026: number;
  visitsPerMonth: number;
  totalVisits: number;
  visitsThrough2026: number;
  visitsAfter2026: number;
  saveThrough2026: number;
  saveAfter2026: number;
  totalSavings: number;
};

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function clampTicket(ticket: number) {
  if (!Number.isFinite(ticket) || ticket < 0) return 0;
  return Math.min(ticket, BITCOIN_TRANSACTION_CAP);
}

export function calculateFees(ticketInput: number): FeeResult {
  const ticket = clampTicket(ticketInput);
  const cardFee = roundMoney(ticket * CARD_PERCENT_RATE + CARD_FIXED_FEE);
  const bitcoinFeeLater = roundMoney(ticket * BITCOIN_2027_RATE);

  return {
    ticket,
    cardFee,
    bitcoinFeeNow: 0,
    bitcoinFeeLater,
    saveNow: cardFee,
    saveLater: roundMoney(cardFee - bitcoinFeeLater)
  };
}

export function calculateHorizonSavings(
  ticketInput: number,
  visitsPerMonthInput: number,
  months = 12,
  now = new Date()
): HorizonResult {
  const fees = calculateFees(ticketInput);
  const visitsPerMonth = Math.max(0, visitsPerMonthInput);
  const start = startOfFullMonth(now);
  const monthsThrough2026 = countMonthsThrough2026(start, months);
  const monthsAfter2026 = months - monthsThrough2026;
  const totalVisits = visitsPerMonth * months;
  const visitsThrough2026 = visitsPerMonth * monthsThrough2026;
  const visitsAfter2026 = visitsPerMonth * monthsAfter2026;

  return {
    months,
    monthsThrough2026,
    monthsAfter2026,
    visitsPerMonth,
    totalVisits,
    visitsThrough2026,
    visitsAfter2026,
    saveThrough2026: roundMoney(visitsThrough2026 * fees.saveNow),
    saveAfter2026: roundMoney(visitsAfter2026 * fees.saveLater),
    totalSavings: roundMoney(
      visitsThrough2026 * fees.saveNow + visitsAfter2026 * fees.saveLater
    )
  };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(roundMoney(value));
}

export function formatVisits(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1
  }).format(value);
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function startOfFullMonth(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return date.getDate() === 1 ? start : addMonths(start, 1);
}

function countMonthsThrough2026(start: Date, months: number) {
  let count = 0;

  for (let index = 0; index < months; index += 1) {
    const month = addMonths(start, index);
    if (month.getFullYear() <= 2026) count += 1;
  }

  return count;
}
