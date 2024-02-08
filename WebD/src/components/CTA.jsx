import styles from "../style";
import Button from "./Button";
import Lottie from "react-lottie";
import animationData from "../assets/business-team.json";

const CTA = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
    >
      <div className="flex-1 flex flex-col">
        <h2 className={styles.heading2}>
          Start Predicting <br className="sm:block hidden" /> with TensorForce
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Optimize your Investments Now
        </p>
        <div className="mt-10">
          <Button label="Sign Up Now" />
        </div>
      </div>
      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <Lottie options={defaultOptions} height={500} width={500} />
      </div>
    </section>
  );
};

export default CTA;
