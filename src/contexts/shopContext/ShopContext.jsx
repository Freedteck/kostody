import { useState } from "react";
import { ShopContext } from "./shop";

const ShopProvider = ({ children }) => {
  const [shop, setShop] = useState(() => {
    const stored = localStorage.getItem("kostody_shop");
    return stored ? JSON.parse(stored) : null;
  });

  const updateShop = (shopData) => {
    localStorage.setItem("kostody_shop", JSON.stringify(shopData));
    setShop(shopData);
  };

  return (
    <ShopContext.Provider value={{ shopId: shop?.id, setShop: updateShop }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
