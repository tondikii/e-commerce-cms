export const generateSku = (
  productId: number,
  productName: string,
  options: Record<string, string>
): string => {
  const productAbbr = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 6);

  const optionsStr = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, value]) => value.toUpperCase().substring(0, 2))
    .join("");

  return `${productAbbr}-${optionsStr}-${String(productId).padStart(4, "0")}`;
};
