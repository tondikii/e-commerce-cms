export const generateSku = (
  productId: number,
  productName: string,
  options: Record<string, string>
): string => {
  const productCode = productName
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 4)
    .toUpperCase();

  const optionCodes = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const keyCode = key.substring(0, 2).toUpperCase();
      const valueCode = value.substring(0, 2).toUpperCase();
      return `${keyCode}${valueCode}`;
    })
    .join("");

  const checksum = simpleChecksum(`${productId}-${JSON.stringify(options)}`);

  return `${productCode}-${optionCodes}-${checksum}`;
};

const simpleChecksum = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return Math.abs(hash).toString(36).substring(0, 3).toUpperCase();
};
