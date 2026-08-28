import Seo from "../../components/common/Seo";
import TermsHero from "../sections/TermsHero";
import TermsBody from "../sections/TermsBody";

const Terms = () => {
  return (
    <>
      <Seo
        title="Terms of Service"
        path="/terms"
        description="The rules governing the shared record, shop obligations, and customer PIN authorizations."
      />
      <TermsHero />
      <TermsBody />
    </>
  );
};

export default Terms;
