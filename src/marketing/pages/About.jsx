import Seo from "../../components/common/Seo";
import AboutHero from "../sections/AboutHero";
import Distrust from "../sections/Distrust";
import Convictions from "../sections/Convictions";
import Refusals from "../sections/Refusals";
import Pledge from "../sections/Pledge";

const About = () => {
  return (
    <>
      <Seo
        title="About Us"
        path="/about"
        description="Why we built Kostody. Replacing word-against-word repair disputes with an unalterable, time-stamped history."
      />
      <AboutHero />
      <Distrust />
      <Convictions />
      <Refusals />
      <Pledge />
    </>
  );
};

export default About;
