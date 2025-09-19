export type OrderQueryParams = {
  productId: number;
  quantity: number;
};

export class InsufficientStockError extends Error {
  constructor(public errors: string[]) {
    super("Insufficient stock");
    this.name = "InsufficientStockError";
  }
}
