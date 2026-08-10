import { useContext } from "react";
import { ShopContext } from "../contexts/shopContext/shop";

const useShop = () => {
  const context = useContext(ShopContext);
  if (context) {
    return context;
  }
};

export default useShop;
