import {createContext} from "react";
import {Cart} from "@/types";

export const CartContext = createContext<{
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
}>({
  cart: {},
  setCart: () => {
    // do nothing
  },
});
