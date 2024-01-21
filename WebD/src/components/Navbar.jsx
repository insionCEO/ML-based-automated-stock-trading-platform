import React, { useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import Button from "./Button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
	const [toggle, setToggle] = useState(false);

	const navigate = useNavigate();

	const handleDashboardClick = () => {
		navigate("./dashboard");
	};

	const handleLogin = () => {
		loginWithRedirect();
	};

	const handleLogout = () => {
		logout({ returnTo: window.location.origin });
	};

	const renderProfileButton = () => {
		if (isLoading) {
			return null;
		}

		if (isAuthenticated) {
			return (
				<div className="relative ml-auto">
					<img
						id="avatarButton"
						type="button"
						data-dropdown-toggle="userDropdown"
						data-dropdown-placement="bottom-start"
						className="w-10 h-10 rounded-full cursor-pointer"
						src={user.picture}
						alt="User dropdown"
						onClick={() => setToggle(!toggle)}
					/>

					{toggle && (
						<div
							id="userDropdown"
							className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-900 dark:divide-gray-600 absolute top-16 right-0 mt-2 p-2"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
								<div className="font-medium truncate">{user.email}</div>
							</div>
							<ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
								<li>
									<a
										href="#"
										className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
										onClick={handleDashboardClick}
									>
										Dashboard
									</a>
								</li>
								<li>
									<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Settings
									</a>
								</li>
								<li>
									<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
										Earnings
									</a>
								</li>
							</ul>
							<div className="py-1">
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
									onClick={(e) => {
										e.preventDefault();
										handleLogout();
									}}
								>
									Sign out
								</a>
							</div>
						</div>
					)}
				</div>
			);
		} else {
			return <Button onClick={handleLogin} label="Login" styles="ml-auto" />;
		}
	};

	return (
		<nav className="w-full flex py-6 items-center navbar">
			<img src={logo} alt="TensorForce" className="w-[124px] h-[32px]" />

			<ul className="list-none sm:flex hidden items-center flex-1 ml-6">
				<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
					<a href="/#home">Home</a>
				</li>

				<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
					<a href="/#features">Features</a>
				</li>
				<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
					<a href="/#product">Product</a>
				</li>
				<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
					<a href="/#clients">Clients</a>
				</li>
				<li className={`font-poppins font-normal cursor-pointer text-[16px] mr-10 text-white hover:text-blue-500`}>
					<a href="/contact">Contact Us</a>
				</li>
				<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white hover:text-blue-500`}>
					<a href="/dashboardv2">Dashboard</a>
				</li>
			</ul>

			{renderProfileButton()}

			<div className="sm:hidden flex flex-1 justify-end items-center">
				<img
					src={toggle ? close : menu}
					alt="menu"
					className="w-[28px] h-[28px] object-contain"
					onClick={() => setToggle(!toggle)}
				/>

				<div
					className={`${
						toggle ? "flex" : "hidden"
					} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
				>
					<ul className="list-none flex flex-col justify-end items-center flex-1">
						<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
							<a href="/#home">Home</a>
						</li>
						<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
							<a href="/#features">Features</a>
						</li>
						<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
							<a href="/#product">Product</a>
						</li>
						<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white mr-10 hover:text-blue-500`}>
							<a href="/#clients">Clients</a>
						</li>
						<li className={`font-poppins font-normal cursor-pointer text-[16px] text-white hover:text-blue-500`}>
							<a href="/contact">Contact Us</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
