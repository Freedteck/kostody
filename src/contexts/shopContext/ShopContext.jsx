import { ShopContext } from "./shop";

const ShopProvider = ({ children }) => {
  const shop = localStorage.getItem("kostody_shop") || "";
  const shopId = shop ? JSON.parse(shop).id : "";
  return (
    <ShopContext.Provider value={{ shopId }}>{children}</ShopContext.Provider>
  );
};

export default ShopProvider;
