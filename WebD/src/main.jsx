import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import "./index.css";
import ContextProvider from "./MainDashboard/contexts/ContextProvider";
import { registerLicense } from "@syncfusion/ej2-base";

const AppWrapper = () => {
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
					<AppRoutes />
				</Router>
			</ContextProvider>
		</Auth0Provider>
	);
};

const root = createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
