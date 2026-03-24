import { financeCalculations, calclateDailyBalances } from "./financeCalculations";
import { Transaction } from "../types";

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2026-03-01",
    amount: 200000,
    content: "給与",
    type: "income",
    category: "給与",
  },
  {
    id: "2",
    date: "2026-03-05",
    amount: 5000,
    content: "食料品",
    type: "expense",
    category: "食費",
  },
  {
    id: "3",
    date: "2026-03-05",
    amount: 3000,
    content: "電車代",
    type: "expense",
    category: "交通費",
  },
  {
    id: "4",
    date: "2026-03-10",
    amount: 50000,
    content: "副業",
    type: "income",
    category: "副収入",
  },
];

describe("financeCalculations", () => {
  it("収入・支出・残高を正しく計算する", () => {
    const result = financeCalculations(transactions);
    expect(result.income).toBe(250000);
    expect(result.expense).toBe(8000);
    expect(result.balance).toBe(242000);
  });

  it("空の配列を渡すと全て0になる", () => {
    const result = financeCalculations([]);
    expect(result.income).toBe(0);
    expect(result.expense).toBe(0);
    expect(result.balance).toBe(0);
  });
});

describe("calclateDailyBalances", () => {
  it("日付ごとに収支を集計する", () => {
    const result = calclateDailyBalances(transactions);

    expect(result["2026-03-01"].income).toBe(200000);
    expect(result["2026-03-01"].expense).toBe(0);
    expect(result["2026-03-01"].balance).toBe(200000);

    // 同じ日付の複数トランザクションが合算される
    expect(result["2026-03-05"].income).toBe(0);
    expect(result["2026-03-05"].expense).toBe(8000);
    expect(result["2026-03-05"].balance).toBe(-8000);

    expect(result["2026-03-10"].income).toBe(50000);
    expect(result["2026-03-10"].expense).toBe(0);
    expect(result["2026-03-10"].balance).toBe(50000);
  });

  it("空の配列を渡すと空オブジェクトになる", () => {
    const result = calclateDailyBalances([]);
    expect(result).toEqual({});
  });
});
