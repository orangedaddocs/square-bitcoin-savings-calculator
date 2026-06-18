import { describe, expect, it } from "vitest";
import {
  BITCOIN_TRANSACTION_CAP,
  calculateFees,
  calculateHorizonSavings,
  formatMoney
} from "./calculator";

describe("calculateFees", () => {
  it("matches Square in-person card fee examples", () => {
    expect(calculateFees(5)).toMatchObject({
      cardFee: 0.28,
      bitcoinFeeNow: 0,
      bitcoinFeeLater: 0.05,
      saveNow: 0.28,
      saveLater: 0.23
    });
    expect(calculateFees(15)).toMatchObject({
      cardFee: 0.54,
      bitcoinFeeLater: 0.15,
      saveLater: 0.39
    });
    expect(calculateFees(100)).toMatchObject({
      cardFee: 2.75,
      bitcoinFeeLater: 1,
      saveLater: 1.75
    });
  });

  it("caps Bitcoin ticket math at the current Square transaction limit", () => {
    expect(calculateFees(900).ticket).toBe(BITCOIN_TRANSACTION_CAP);
    expect(calculateFees(900).cardFee).toBe(15.75);
  });
});

describe("calculateHorizonSavings", () => {
  it("splits an 18 month horizon between fee-free 2026 and 2027+ 1% fees", () => {
    const result = calculateHorizonSavings(
      15,
      4.33,
      18,
      new Date("2026-06-18T12:00:00")
    );

    expect(result.totalVisits).toBeCloseTo(77.94, 2);
    expect(result.visitsThrough2026).toBeGreaterThan(25);
    expect(result.visitsAfter2026).toBeGreaterThan(45);
    expect(result.totalSavings).toBeGreaterThan(30);
    expect(result.totalSavings).toBeLessThan(40);
  });
});

describe("formatMoney", () => {
  it("formats values as US dollars", () => {
    expect(formatMoney(2.755)).toBe("$2.76");
  });
});
