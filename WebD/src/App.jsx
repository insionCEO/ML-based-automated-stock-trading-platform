import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Contact from "./Contact";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// <div className="bg-primary w-full overflow-hidden">
//   <div className={`${styles.paddingX} ${styles.flexCenter}`}>
//     <div className={`${styles.boxWidth}`}>
//       <Navbar />
//     </div>
//   </div>

//   <div className={`bg-primary ${styles.flexStart}`}>
//     <div className={`${styles.boxWidth}`}>
//       <Hero />
//     </div>
//   </div>

//   <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
//     <div className={`${styles.boxWidth}`}>
//       <Stats /> <Clients /> <Research /> <Billing /> <CardDeal />{" "}
//       <Testimonials /> <CTA /> <Footer />
//     </div>
//   </div>
// </div>
