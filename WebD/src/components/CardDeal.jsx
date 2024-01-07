import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Track your Performance <br className="sm:block hidden" />& Improve your
        Stratergies.
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
      <img src={card} alt="card" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
