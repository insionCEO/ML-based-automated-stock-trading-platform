import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Login from "./Login/Login";
import Contact from "./Contact";
import Dashv2 from "./MainDashboard/Dashv2";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ element }) => {
	const { user } = useAuth0();

	return user ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
	const { isLoading } = useAuth0();

	useEffect(() => {
		const checkLoadingStatus = () => {
			if (isLoading) {
				setTimeout(checkLoadingStatus, 10);
			}
		};

		if (isLoading) {
			checkLoadingStatus();
		}
	}, [isLoading]);

	return !isLoading ? (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/login" element={<Login />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/dashboardv2/*" element={<ProtectedRoute element={<Dashv2 />} />} />
			<Route path="*" element={<ErrorPage />} />
		</Routes>
	) : null;
};

export default AppRoutes;
