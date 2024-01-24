import React, { createContext, useContext, useState } from "react";
const StateContext = createContext();

const initialState = {
	chat: false,
	cart: false,
	userProfile: false,
	notification: false,
};

export const ContextProvider = ({ children }) => {
	const [activeMenu, setActiveMenu] = useState(true);
	const [isClicked, setIsClicked] = useState(initialState);
	const [screenSize, setScreenSize] = useState(undefined);

	const [currentColor, setCurrentColor] = useState("#03C9D7");
	const [currentMode, setCurrentMode] = useState("Dark");
	const [themeSettings, setThemeSettings] = useState(false);

	const setMode = (e) => {
		setCurrentMode(e.target.value);
		localStorage.setItem("themeMode", e.target.value);
		setThemeSettings(false);
	};

	const setColor = (color) => {
		setCurrentColor(color);
		localStorage.setItem("colorMode", color);
		setThemeSettings(false);
	};

	const handleClick = (clicked) => {
		setIsClicked((prevIsClicked) => ({
			...initialState,
			[clicked]: !prevIsClicked[clicked],
		}));
	};

	return (
		<StateContext.Provider
			value={{
				activeMenu,
				setActiveMenu,
				isClicked,
				setIsClicked,
				handleClick,
				screenSize,
				setScreenSize,
				currentColor,
				currentMode,
				setCurrentColor,
				setCurrentMode,
				themeSettings,
				setThemeSettings,
				setMode,
				setColor,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};
export const useStateContext = () => useContext(StateContext);
export default ContextProvider;
