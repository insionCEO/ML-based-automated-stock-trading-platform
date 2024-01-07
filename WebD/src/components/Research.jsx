import styles from "../style";
import Button from "./Button";
import { robot } from "../assets";

const Research = () => (
  <section
    className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
  >
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>
        Introducing <br className="sm:block hidden" /> TensorForce
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Join our community and start predicting today!
      </p>
      <div className="mt-10">
        <Button label="Get Started" />
      </div>
    </div>
    <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
      <img
        src={robot}
        alt="billing"
        className="w-[500px] h-[500px] relative z-[5]"
      />
    </div>
  </section>
);

export default Research;
