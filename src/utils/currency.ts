// src/utils/currency.ts
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const parseCurrency = (value: string): number => {
  // Remove non-digit characters
  const numericValue = value.replace(/[^\d]/g, "");
  return numericValue ? parseInt(numericValue, 10) : 0;
};

export const formatCurrencyInput = (value: string): string => {
  if (!value) return "";

  // Remove non-digit characters
  const numericValue = value.replace(/[^\d]/g, "");
  if (!numericValue) return "";

  return formatCurrency(parseInt(numericValue, 10));
};
