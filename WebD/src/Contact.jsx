import React from "react";
import styles from "./style";
import {
  Navbar,
  Hero,
  Stats,
  Research,
  Billing,
  CardDeal,
  Testimonials,
  Clients,
  CTA,
  Query,
  Footer,
} from "./components";

const Contact = () => {
  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Query />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Contact;
