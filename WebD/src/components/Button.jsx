import React from "react";

const Button = ({ label, styles }) => {
  return (
    <button
      type="button"
      className={`py-3 px-4 bg-black-gradient font-poppins font-medium text-[18px] text-dimWhite outline-none ${styles} rounded-[10px]`}
    >
      {label}
    </button>
  );
};

export default Button;
