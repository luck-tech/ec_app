import {throwResponseError} from "@/lib/error";
import {ProductWithDetails} from "@/types";

export const searchProducts = async ({
  page,
  filter,
}: {
  page: number;
  filter: string;
}): Promise<{
  products: ProductWithDetails[];
  hitCount: number;
}> => {
  const baseUrl = `/api/products/search`;
  const queryParams = new URLSearchParams();

  if (page) {
    queryParams.append("page", page.toString());
  }
  if (filter) {
    queryParams.append("filter", filter);
  }

  const url = `${baseUrl}?${queryParams.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const getProducts = async (
  productIds: number[],
): Promise<ProductWithDetails[]> => {
  const baseUrl = `/api/products`;
  const queryParams = new URLSearchParams();

  if (productIds.length > 0) {
    queryParams.append("productIds", productIds.join(","));
  }

  const url = `${baseUrl}?${queryParams.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};
