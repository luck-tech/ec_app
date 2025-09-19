export interface ProductItem {
  id: number;
  name: string;
  price: number;
  imageName: string;
  stockId: number;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  lastOrderedAt?: string;
}

export interface ProductSearchParams {
  filter: string;
  page: number;
  userId: number;
}

export interface ProductQueryParams {
  productIds?: string;
  userId?: number;
}

export interface ProductSearchResponse {
  products: ProductItem[];
  hitCount: number;
}
