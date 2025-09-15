import {JSX, useContext} from "react";
import {CartContext} from "@/providers/cart";
import {ProductWithDetails} from "@/types";

export function ProductList({
  products,
}: {
  products: ProductWithDetails[];
}): JSX.Element {
  return (
    <ul className="flex flex-col gap-4" data-test="product-list">
      {products.map(product => (
        <ProductListItem product={product} key={product.id} />
      ))}
    </ul>
  );
}

function ProductListItem({
  product,
}: {
  product: ProductWithDetails;
}): JSX.Element {
  const lastOrderedAt = product.lastOrderedAt
    ? new Date(product.lastOrderedAt)
    : undefined;

  return (
    <li
      className="flex flex-row justify-between gap-8 border p-4"
      data-test={`product-item-${product.id}`}
    >
      <div className="flex flex-row items-center gap-8">
        <img
          src={`/image/${product.imageName}`}
          className="h-32"
          data-test="product-image"
        />
        <div className="flex flex-col">
          {lastOrderedAt && (
            <div data-test="product-last-ordered-at">
              last order: {lastOrderedAt.getFullYear()}/
              {lastOrderedAt.getMonth() + 1}/{lastOrderedAt.getDate()}
            </div>
          )}
          <div className="text-xl" data-test="product-name">
            {product.name}
          </div>
          <div className="font-bold" data-test="product-price">
            {product.price} coins
          </div>
        </div>
      </div>
      <QuantityInput productId={product.id} quantity={product.quantity} />
    </li>
  );
}

function QuantityInput({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}): JSX.Element {
  const {cart, setCart} = useContext(CartContext);

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setCart(prev => {
      const newQuantity = Number(event.target.value);
      if (newQuantity <= 0) {
        const {[productId]: _, ...rest} = prev;
        return rest;
      }
      return {...prev, [productId]: newQuantity};
    });
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      <input
        type="number"
        min={0}
        max={quantity}
        onChange={handleQuantityChange}
        value={cart[productId] ?? 0}
        disabled={quantity === 0}
        className="border p-1 w-20"
        data-test="product-quantity-input"
      />
      <span data-test="product-stock-quantity">stock: {quantity}</span>
    </div>
  );
}
