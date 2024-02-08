// // TradingViewWidget.jsx
// import React, { useEffect, useRef, memo, useContext } from "react";
// import ThemeContext from "../context/ThemeContext";
// import StockContext from "../context/StockContext";

// function Chart() {
// 	const container = useRef();
// 	const { darkMode } = useContext(ThemeContext);

// 	const { stockSymbol } = useContext(StockContext);

// 	useEffect(() => {
// 		const script = document.createElement("script");
// 		script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
// 		script.type = "text/javascript";
// 		script.async = true;
// 		script.innerHTML = `
//         {
//           "autosize": true,
//           "symbol": "${stockSymbol}",
//           "interval": "D",
//           "timezone": "Etc/UTC",
//           "theme": "${darkMode ? "dark" : "light"}",
//           "style": "1",
//           "locale": "in",
//           "enable_publishing": false,
//           "allow_symbol_change": true,
//           "support_host": "https://www.tradingview.com"
//         }`;
// 		container.current.appendChild(script);
// 	}, []);

// 	return (
// 		<div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
// 			<div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
// 			<div className="tradingview-widget-copyright">
// 				<a href="https://in.tradingview.com/" rel="noopener nofollow" target="_blank">
// 					<span className="blue-text">Track all markets on TradingView</span>
// 				</a>
// 			</div>
// 		</div>
// 	);
// }

// export default memo(Chart);

// // TradingViewWidget.jsx

import React, { useEffect, useRef, memo, useContext } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import StockContext from "../context/StockContext";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
// import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const Chart = () => {
	const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
	const { stockSymbol } = useContext(StockContext);

	return (
		<div>
			<TradingViewWidget
				symbol={stockSymbol}
				theme={currentMode ? Themes.DARK : Themes.LIGHT}
				locale="in"
				height={750}
				width="full"
			/>

			{/* <AdvancedRealTimeChart theme={darkMode ? "dark" : "light"} className="h-auto"></AdvancedRealTimeChart> */}
		</div>
	);
};

export default Chart;
