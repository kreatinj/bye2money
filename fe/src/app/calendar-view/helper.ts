import type { Item } from "~/api/transactions";

export function dailyTotals(data: Item[], daysInMonth: number) {
  const initialData = Array.from({ length: daysInMonth }, () => ({
    totalAmount: 0,
    totalExpense: 0,
    totalIncome: 0,
  }));

  return data.reduce((dailyData, item) => {
    const day = item.date.date() - 1;
    const currentDay = dailyData[day];

    return [
      ...dailyData.slice(0, day),
      {
        totalAmount: currentDay.totalAmount + item.amount,
        totalExpense: currentDay.totalExpense + (item.amount < 0 ? item.amount : 0),
        totalIncome: currentDay.totalIncome + (item.amount >= 0 ? item.amount : 0),
      },
      ...dailyData.slice(day + 1),
    ];
  }, initialData);
}

export function fold<T>(array: T[], count: number) {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += count) {
    result.push(array.slice(i, i + count));
  }
  return result;
}

export function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => i + start);
}
