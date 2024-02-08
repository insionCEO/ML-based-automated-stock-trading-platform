import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./material.css";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
	Navbar,
	Footer,
	Sidebar,
	ThemeSettings,
} from "./components";
import {
	Dashboard,
	Orders,
	// Calendar,
	News,
	// Stacked,
	// Pyramid,
	Contribute,
	// Area,
	// Bar,
	// ColorPicker,
	// Editor,
} from "./pages";
import axios from "axios";
import Profile from "./pages/Profile";
import { useStateContext } from "./contexts/ContextProvider";
import "./App.css";
import CompanyFinancials from "./CompanyFinancials/CompanyFinancials";
import Positions from "./pages/Positions";
import Heatmap from "./pages/Heatmap";
import Shop from "./pages/Shop";
import SentimentPage from "./pages/SentimentPage";

const Dashv2 = () => {
	const {
		activeMenu,
		themeSettings,
		setThemeSettings,
		currentColor,
		currentMode,
	} = useStateContext();

	const { user, isAuthenticated, isLoading } = useAuth0();

	useEffect(() => {
		const sendUserData = async () => {
			if (isAuthenticated && user) {
				const userData = {
					username: user.name,
					email: user.email,
				};

				try {
					const response = await axios.post(
						"https://tensorforce-backend.onrender.com/api/authenticate",
						userData
					);

					if (response.status === 200) {
						const responseData = response.data;
						// console.log("Response data:", responseData);
					} else {
						console.error("Error sending user data");
					}
				} catch (error) {
					console.error(
						"Error sending user data:",
						error.response || error.message || error
					);
				}
			}
		};

		sendUserData();
	}, [isAuthenticated, user]);

	return (
		<Auth0Provider
			domain="dev-ovhg6woj2jzt3u4i.au.auth0.com"
			clientId="pEXH5RDJNSLcLz8VAH3Ac5kpI4b6gq8w"
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<div className={currentMode === "Dark" ? "dark" : ""}>
				<div className="flex relative dark:bg-main-dark-bg">
					{activeMenu ? (
						<div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
							<Sidebar />
						</div>
					) : (
						<div className="w-0 dark:bg-secondary-dark-bg">
							<Sidebar />
						</div>
					)}
					<div
						className={
							activeMenu
								? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
								: "dark:bg-main-dark-bg bg-main-bg min-h-screen w-full flex-2"
						}
					>
						<div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navber w-full">
							<Navbar />
						</div>
						<div>
							{themeSettings && <ThemeSettings />}
							<Routes>
								{/* Dashboard */}
								<Route path="/" element={<Dashboard />} />
								<Route path="/dashboard" element={<Dashboard />} />

								{/* {Pages} */}
								<Route path="/positions" element={<Positions />} />
								<Route path="/news" element={<News />} />
								<Route path="/orders" element={<Orders />} />

								{/* Apps */}
								{/* <Route path="/kanban" element={<Kanban />} /> */}
								{/* <Route path="/editor" element={<Editor />} /> */}
								{/* <Route path="/calendar" element={<Calendar />} /> */}
								{/* <Route
									path="/color-picker"
									element={<ColorPicker />}
								/> */}

								{/* Charts */}
								<Route path="/profile" element={<Profile />} />
								{/* <Route path="/area" element={<Area />} /> */}
								{/* <Route path="/bar" element={<Bar />} /> */}
								<Route
									path="/sentiment"
									element={<SentimentPage />}
								/>
								{/* <Route path="/financial" element={<Financial />} /> */}
								{/* <Route path="/pyramid" element={<Pyramid />} /> */}
								{/* <Route path="/stacked" element={<Stacked />} /> */}

								{/* My Routes */}
								<Route
									path="/financials"
									element={<CompanyFinancials />}
								/>
								<Route path="/heatmap" element={<Heatmap />} />
								<Route path="/shop" element={<Shop />} />
								<Route path="/contribute" element={<Contribute />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>
		</Auth0Provider>
	);
};

export default Dashv2;
