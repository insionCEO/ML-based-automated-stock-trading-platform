import { apple, google } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";
import Lottie from "react-lottie";
import animationData from "../assets/Analysis Digital Marketing.json";

const Billing = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={layout.sectionImgReverse}>
        <Lottie
          options={defaultOptions}
          height="100%"
          width="100%"
          className="relative z-[5]"
        />
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient"></div>
        <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient"></div>
      </div>

      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          All the Information <br className="sm:block hidden" /> you need.
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          We provide a comprehensive research reference page where you can find
          all the information and data you need to make informed investment
          decisions. Our platform is equipped with advanced search options to
          help you find the data you're looking for.
        </p>

        <div className="mt-10">
          <Button label="Start Research" />
        </div>
      </div>
    </section>
  );
};

export default Billing;
