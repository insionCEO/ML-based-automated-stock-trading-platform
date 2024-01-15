import React from "react";
import styles from "../style";
import { discount, robot } from "../assets";
import GetStarted from "./GetStarted";
import Button from "./Button";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">Free </span>
            Trial for <span className="text-white">1 Month </span>
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
            The Best Way to <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Predict</span> <br />
          </h1>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100px] leading-[75px] w-full">
          Stock Prices.
        </h1>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Here you can find and develop your own stock prediction.
        </p>

        <div className="flex mt-4">
          {" "}
          {/* Add a div to wrap the buttons */}
          <Button label="Try Now" styles="mr-2" />{" "}
          {/* Add right margin to the first button */}
          <Button label="Explore Features" />
        </div>
      </div>

      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <img
          src={robot}
          alt="billing"
          className="w-[500px] h-[500px] relative z-[5]"
        />

        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient"></div>
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient"></div>
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient"></div>
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted></GetStarted>
      </div>
    </section>
  );
};

export default Hero;
