import styles, { layout } from "../style";
import Button from "./Button";
import Lottie from "react-lottie";
import animationData from "../assets/Cb7PYb6sBk.json";

const CardDeal = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          Track your Performance <br className="sm:block hidden" />& Improve
          your Strategies.
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          With our performance tracker, you can easily monitor and analyze your
          stock prediction models' performance. Gain valuable insights and make
          data-driven decisions to improve your strategies and maximize your
          returns.
        </p>

        <Button label="Track Performance" styles="mt-10" />
      </div>

      <div className={layout.sectionImg}>
        <Lottie options={defaultOptions} height="100%" width="100%" />
      </div>
    </section>
  );
};

export default CardDeal;
