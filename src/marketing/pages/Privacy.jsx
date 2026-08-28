import Seo from "../../components/common/Seo";
import PrivacyHero from "../sections/PrivacyHero";
import PrivacyBody from "../sections/PrivacyBody";

const Privacy = () => {
  return (
    <>
      <Seo
        title="Privacy Policy"
        path="/privacy"
        description="What we collect, what we never touch, and who sees what."
      />
      <PrivacyHero />
      <PrivacyBody />
    </>
  );
};

export default Privacy;
