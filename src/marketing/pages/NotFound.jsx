import Seo from "../../components/common/Seo";
import NotFoundHero from "../sections/NotFoundHero";

const NotFound = () => {
  return (
    <>
      <Seo
        title="404 Page Not Found"
        path="/404"
        description="This page is not on the record."
      />
      <NotFoundHero />
    </>
  );
};

export default NotFound;
