import Seo from "../../components/common/Seo";
import HelpHero from "../sections/HelpHero";
import ThreeWayMap from "../sections/ThreeWayMap";
import HelpScenarios from "../sections/HelpScenarios";
import AntiScam from "../sections/AntiScam";
import HelpCoda from "../sections/HelpCoda";

const Help = () => {
  return (
    <>
      <Seo
        title="Help & Support"
        path="/help"
        description="How repairs, records, and PIN authorization work on Kostody."
      />
      <HelpHero />
      <ThreeWayMap />
      <HelpScenarios />
      <AntiScam />
      <HelpCoda />
    </>
  );
};

export default Help;
