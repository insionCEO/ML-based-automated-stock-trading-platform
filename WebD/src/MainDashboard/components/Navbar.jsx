import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useAuth0 } from "@auth0/auth0-react";
import svg from "../../assets/avatar-svgrepo-com.svg";
import { Cart, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => {
	const handleClick = () => {
		if (customFunc) {
			customFunc();
		}
	};
	return (
		<TooltipComponent content={title} position="BottomCenter">
			<button
				type="button"
				onClick={handleClick}
				style={{ color }}
				className="relative text-xl rounded-full p-3 hover:bg-light-gray"
			>
				<span
					style={{ background: dotColor }}
					className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
				/>
				{icon}
			</button>
		</TooltipComponent>
	);
};

const Navbar = () => {
	const {
		activeMenu,
		setActiveMenu,
		isClicked,
		setIsClicked,
		handleClick,
		screenSize,
		setScreenSize,
		currentColor,
	} = useStateContext();

	const {
		isAuthenticated,
		loginWithRedirect,
		logout,
		user,
		isLoading,
	} = useAuth0();

	useEffect(() => {
		const handleResize = () => setScreenSize(window.innerWidth);

		const handleResizeCallback = () => {
			handleResize();
		};

		window.addEventListener("resize", handleResizeCallback);

		return () =>
			window.removeEventListener("resize", handleResizeCallback);
	}, [setScreenSize]);

	useEffect(() => {
		if (screenSize <= 900) {
			setActiveMenu(false);
		} else {
			setActiveMenu(true);
		}
	}, [screenSize, setActiveMenu]);

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className="flex justify-between p-2 md:mx-6 relative">
			<NavButton
				title="Menu"
				customFunc={() =>
					setActiveMenu((prevActiveMenu) => !prevActiveMenu)
				}
				color={currentColor}
				icon={<AiOutlineMenu />}
			/>
			<div className="flex">
				<NavButton
					title="Cart"
					customFunc={() => handleClick("cart")}
					color={currentColor}
					icon={<FiShoppingCart />}
				/>

				<TooltipComponent content="Profile" position="BottomCenter">
					<div
						className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
						onClick={() => handleClick("userProfile")}
					>
						<img
							className="rounded-full w-8 h-8"
							src={user.picture || svg}
						/>
						<p>
							<span className="text-gray-400 text-14"> Hi,</span>{" "}
							<span className="text-gray-400 font-bold ml-1 text-14">
								{user.name.match(/^([^@]*)@/)[1]}
							</span>
						</p>
						<MdKeyboardArrowDown className="text-gray-400 text-14" />
					</div>
				</TooltipComponent>
				{isClicked.cart && <Cart />}
				{isClicked.userProfile && <UserProfile />}
			</div>
		</div>
	);
};

export default Navbar;
