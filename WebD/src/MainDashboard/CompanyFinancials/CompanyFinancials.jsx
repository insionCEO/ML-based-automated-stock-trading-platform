import { useState } from "react";
// import "./App.css";
import Dashboard from "./components/Dashboard";
import StockContext from "./context/StockContext";
import { useStateContext } from "../contexts/ContextProvider";

function CompanyFinancials() {
	const [stockSymbol, setStockSymbol] = useState("MSFT");
	const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();

	return (
		<StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
			<Dashboard />
		</StockContext.Provider>
	);
}

export default CompanyFinancials;
