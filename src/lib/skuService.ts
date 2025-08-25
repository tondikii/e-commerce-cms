// src/lib/skuService.ts
export class SkuService {
  static generateSku(
    productId: number,
    productName: string,
    options: Record<string, string>
  ): string {
    // 1. Product Part (7 chars)
    const productPart = this.getProductPart(productId, productName);

    // 2. Options Part (6-10 chars)
    const optionsPart = this.getOptionsPart(options);

    // 3. Checksum (3 chars)
    const checksum = this.getChecksum(productId, options);

    return `${productPart}-${optionsPart}-${checksum}`;
  }

  private static getProductPart(
    productId: number,
    productName: string
  ): string {
    const idPart = String(productId).padStart(4, "0");
    const namePart = productName
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .substring(0, 3);

    return `${idPart}${namePart}`;
  }

  private static getOptionsPart(options: Record<string, string>): string {
    return Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const keyCode = key.toUpperCase().substring(0, 2);
        const valueCode = value.toUpperCase().substring(0, 2);
        return `${keyCode}${valueCode}`;
      })
      .join("");
  }

  private static getChecksum(
    productId: number,
    options: Record<string, string>
  ): string {
    const data = `${productId}-${JSON.stringify(options)}`;
    let hash = 0;

    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
    }

    return Math.abs(hash).toString(36).toUpperCase().substring(0, 3);
  }

  static async validateSkuUniqueness(sku: string): Promise<boolean> {
    const existing = await prisma?.productVariant.findUnique({
      where: {sku},
      select: {id: true},
    });

    return !existing;
  }
}
