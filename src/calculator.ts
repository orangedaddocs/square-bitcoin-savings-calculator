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
  visitsPerMonth: number;
  totalVisits: number;
  visitsThrough2026: number;
  visitsAfter2026: number;
  saveThrough2026: number;
  saveAfter2026: number;
  totalSavings: number;
};

const START_OF_2027 = new Date("2027-01-01T00:00:00");

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
  months = 18,
  now = new Date()
): HorizonResult {
  const fees = calculateFees(ticketInput);
  const visitsPerMonth = Math.max(0, visitsPerMonthInput);
  const totalVisits = visitsPerMonth * months;
  const end = addMonths(now, months);
  const totalDays = Math.max(1, daysBetween(now, end));
  const daysThrough2026 = Math.max(
    0,
    Math.min(daysBetween(now, START_OF_2027), totalDays)
  );
  const through2026Share = daysThrough2026 / totalDays;
  const visitsThrough2026 = totalVisits * through2026Share;
  const visitsAfter2026 = totalVisits - visitsThrough2026;

  return {
    months,
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

function daysBetween(start: Date, end: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return (end.getTime() - start.getTime()) / msPerDay;
}
