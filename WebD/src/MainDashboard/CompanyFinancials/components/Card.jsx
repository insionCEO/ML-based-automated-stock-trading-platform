import React, { useContext } from "react";
import { useStateContext } from "../../contexts/ContextProvider";

const Card = ({ children }) => {
	const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
	return (
		<div
			className={`w-full h-full rounded-md relative p-8 border-2 ${
				currentMode ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
			}`}
		>
			{children}
		</div>
	);
};

export default Card;
