import Seo from "../../components/common/Seo";
import ProductHero from "../sections/ProductHero";
import AppShowcase from "../sections/AppShowcase";
import SharedRecord from "../sections/SharedRecord";

const Product = () => {
  return (
    <>
      <Seo
        title="Product & Features"
        path="/product"
        description="Explore the Kostody engineer workbench and customer repair tracker. One shared record, zero altered quotes."
      />
      <ProductHero />
      <AppShowcase />
      <SharedRecord />
    </>
  );
};

export default Product;
