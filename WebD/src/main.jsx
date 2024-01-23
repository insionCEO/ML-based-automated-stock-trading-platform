import React from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Login from "./Login/Login";
import Contact from "./Contact";
import Dashboard from "./Dashboard";
import ContextProvider from "./MainDashboard/contexts/ContextProvider";
import Dashv2 from "./MainDashboard/Dashv2";
import { registerLicense } from "@syncfusion/ej2-base";

const AppWrapper = () => {
	const { isAuthenticated } = useAuth0();
	registerLicense("Ngo9BigBOggjHTQxAR8/V1NAaF5cWWVCfEx0RXxbf1x0ZFdMYFhbQXJPMyBoS35RckViW35ecnZcR2ZYVU1+");

	return (
		<Auth0Provider
			domain="dev-ovhg6woj2jzt3u4i.au.auth0.com"
			clientId="pEXH5RDJNSLcLz8VAH3Ac5kpI4b6gq8w"
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<ContextProvider>
				<Router>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/login" element={<Login />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/dashboardv2/*" element={!isAuthenticated ? <Dashv2 /> : <Navigate to="/login" />} />
						{/* <Route path="*" element={<ErrorPage />} /> */}
					</Routes>
				</Router>
			</ContextProvider>
		</Auth0Provider>
	);
};

const root = createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
