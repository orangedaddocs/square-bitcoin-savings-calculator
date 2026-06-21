import { describe, expect, it } from "vitest";
import {
  BITCOIN_TRANSACTION_CAP,
  calculateFees,
  calculateHorizonSavings,
  calculatePeoplePerMonth,
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
  it("splits the next 12 full months between fee-free 2026 and 2027+ 1% fees", () => {
    const result = calculateHorizonSavings(
      15,
      4.33,
      12,
      new Date("2026-06-18T12:00:00")
    );

    expect(result.monthsThrough2026).toBe(6);
    expect(result.monthsAfter2026).toBe(6);
    expect(result.totalVisits).toBeCloseTo(51.96, 2);
    expect(result.visitsThrough2026).toBeCloseTo(25.98, 2);
    expect(result.visitsAfter2026).toBeCloseTo(25.98, 2);
    expect(result.totalSavings).toBe(24.16);
  });

  it("uses the current month when the calculation runs on the first", () => {
    const result = calculateHorizonSavings(
      10,
      8.66,
      12,
      new Date("2026-07-01T12:00:00")
    );

    expect(result.monthsThrough2026).toBe(6);
    expect(result.monthsAfter2026).toBe(6);
    expect(result.totalVisits).toBeCloseTo(103.92, 2);
  });
});

describe("calculatePeoplePerMonth", () => {
  it("converts people per day using calendar days across the year", () => {
    expect(calculatePeoplePerMonth(10, "day")).toBeCloseTo(304.17, 2);
  });

  it("converts people per week using weeks across the year", () => {
    expect(calculatePeoplePerMonth(10, "week")).toBeCloseTo(43.45, 2);
  });

  it("keeps people per month as monthly volume", () => {
    expect(calculatePeoplePerMonth(10, "month")).toBe(10);
  });
});

describe("formatMoney", () => {
  it("formats values as US dollars", () => {
    expect(formatMoney(2.755)).toBe("$2.76");
  });
});
