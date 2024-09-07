import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import "./index.css";
import ContextProvider from "./MainDashboard/contexts/ContextProvider";
// import { registerLicense } from "@syncfusion/ej2-base";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
// let lic = import.meta.env.VITE_SYNCFUSION_LICENSE;

// try {
// 	const a = registerLicense(lic);
// 	console.log("License registered successfully");
// 	console.log("aaaaa", a);
// } catch (error) {
// 	console.error("Failed to register license:", error);
// }



const AppWrapper = () => {

	return (
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH0_DOMAIN}
			clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<ContextProvider>
				<Router>
					<AppRoutes />
					<Analytics />
					<SpeedInsights />
				</Router>
			</ContextProvider>
		</Auth0Provider>
	);
};

const root = createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
