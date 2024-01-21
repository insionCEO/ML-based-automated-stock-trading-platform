import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Login from "./Login/Login";
// import Root from "./routes/root";
import Contact from "./Contact";
import Dashboard from "./Dashboard";
import ContextProvider from "./MainDashboard/contexts/ContextProvider";
import Dashv2 from "./MainDashboard/Dashv2";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjHTQxAR8/V1NAaF5cWWVCfEx0RXxbf1x0ZFdMYFhbQXJPMyBoS35RckViW35ecnZcR2ZYVU1+");

ReactDOM.createRoot(document.getElementById("root")).render(
	<Auth0Provider
		domain="dev-ovhg6woj2jzt3u4i.au.auth0.com"
		clientId="IqUZH5W3Y1OP2ueWyUhvC7eaMT0WXbLH"
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
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/dashboardv2/*" element={<Dashv2 />} />
				</Routes>
			</Router>
		</ContextProvider>
	</Auth0Provider>
);
