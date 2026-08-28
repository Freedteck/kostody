import Seo from "../../components/common/Seo";
import Hero from "../sections/Hero";
import Gap from "../sections/Gap";
import Dispute from "../sections/Dispute";
import Reframe from "../sections/Reframe";
import Identity from "../sections/Identity";
import Sides from "../sections/Sides";
import Standard from "../sections/Standard";

const Home = () => {
  return (
    <>
      <Seo
        title=""
        path="/"
        description="Track repairs with time-stamped condition photos, fixed quotes, and 4-digit PIN authorization. No arguments, just proof."
      />
      <Hero />
      <Gap />
      <Dispute />
      <Reframe />
      <Identity />
      <Sides />
      <Standard />
    </>
  );
};

export default Home;
