import {JSX, Suspense, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {createOrder} from "@/api/orders";
import {getProducts} from "@/api/products";
import {ProductList} from "@/components/product_list";
import {Loading} from "@/components/loading";
import {CartContext} from "@/providers/cart";
import {HttpResponseError, ValidationError} from "@/lib/error";
import {Cart} from "@/types";

export function CartPage(): JSX.Element {
  const {cart} = useContext(CartContext);

  if (Object.keys(cart).length === 0) {
    return <div data-test="cart-empty-message">Cart is empty</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <CartPanel cart={cart} />
    </Suspense>
  );
}

export function CartPanel({cart}: {cart: Cart}): JSX.Element {
  const navigate = useNavigate();
  const {setCart} = useContext(CartContext);
  const [errors, setErrors] = useState<string[]>([]);
  const productIds = Object.keys(cart).map(Number);

  const {data: products} = useSuspenseQuery({
    queryKey: ["products", {ids: productIds}],
    queryFn: () => getProducts(productIds),
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: ({orderId}) => {
      setCart({});
      navigate(`/orders/${orderId}/complete`);
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        setErrors(error.errors);
      } else if (error instanceof HttpResponseError) {
        setErrors([error.message]);
      } else {
        console.error(error);
        setErrors(["Unexpected error occurred"]);
      }
    },
  });

  const handleButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = event => {
    event.preventDefault();
    setErrors([]);
    mutation.mutate(cart);
  };

  if (Object.keys(cart).length === 0) {
    return <div data-test="cart-empty-message">Cart is empty</div>;
  }

  const totalQuantity = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, product) => sum + (cart[product.id] || 0) * product.price,
    0,
  );

  return (
    <div className="flex flex-col gap-8">
      <ul className="border p-4" data-test="cart-summary">
        <li data-test="total-price">Total price: {totalPrice} coins</li>
        <li data-test="total-quantity">Total quantity: {totalQuantity}</li>
      </ul>
      <ProductList products={products} />
      {errors.length !== 0 ? (
        <ul className="bg-red-100 border border-red-200 text-red-700 p-4">
          {errors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-row justify-center">
        <button
          onClick={handleButtonClick}
          disabled={mutation.isPending}
          className="px-6 py-2 text-lg text-white rounded-lg bg-orange-400"
          data-test="order-button"
        >
          Order
        </button>
      </div>
    </div>
  );
}
