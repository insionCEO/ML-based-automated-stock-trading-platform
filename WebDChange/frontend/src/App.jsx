import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing/Landing.jsx";
import Login from "./Login/Login.jsx";
import Contact from "./Landing/Contact.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";

// import Preferences from "./Dashboard/Preferences.jsx";
// import useToken from "./CustomHooks/UseToken";

const App = () => {
	// const { token, setToken } = useToken();

	// if (!token) {
	// 	return <Landing />;
	// }

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				{/* <Route path="/login" element={<Login setToken={setToken} />} /> */}

				<Route path="/contact" element={<Contact />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;

// // <div className="bg-primary w-full overflow-hidden">
// //   <div className={`${styles.paddingX} ${styles.flexCenter}`}>
// //     <div className={`${styles.boxWidth}`}>
// //       <Navbar />
// //     </div>
// //   </div>

// //   <div className={`bg-primary ${styles.flexStart}`}>
// //     <div className={`${styles.boxWidth}`}>
// //       <Hero />
// //     </div>
// //   </div>

// //   <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
// //     <div className={`${styles.boxWidth}`}>
// //       <Stats /> <Clients /> <Research /> <Billing /> <CardDeal />{" "}
// //       <Testimonials /> <CTA /> <Footer />
// //     </div>
// //   </div>
// // </div>

// import React, { useState } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import "./App.css";
// import Dashboard from "./Dashboard/Dashboard";
// import Login from "./Login/Login";
// import Preferences from "./Dashboard/Preferences";
// import useToken from "./CustomHooks/UseToken";

// function App() {
// 	const { token, setToken } = useToken();

// 	if (!token) {
// 		return <Login setToken={setToken} />;
// 	}

// 	return (
// 		<div className="wrapper">
// 			<h1>Application</h1>
// 			<BrowserRouter>
// 				<Routes>
// 					<Route path="/dashboard">
// 						<Dashboard />
// 					</Route>
// 					<Route path="/preferences">
// 						<Preferences />
// 					</Route>
// 				</Routes>
// 			</BrowserRouter>
// 		</div>
// 	);
// }

// export default App;
