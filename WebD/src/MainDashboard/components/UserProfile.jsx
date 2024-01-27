import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import { useAuth0 } from "@auth0/auth0-react";
import svg from "../../assets/avatar-svgrepo-com.svg";
import avatar from "../data/avatar.jpg";

const UserProfile = () => {
	const {
		isClicked,
		currentColor,
		setIsClicked,
		initialState,
		handleClick,
	} = useStateContext();
	const { logout, user } = useAuth0();

	const handleLogout = () => {
		logout({ returnTo: window.location.origin });
	};

	return (
		<div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
			<div className="flex justify-between items-center">
				<p className="font-semibold text-lg dark:text-gray-200">
					User Profile
				</p>

				<button
					type="button"
					style={{
						color: "rgb(153, 171, 180)",
						borderRadius: "50%",
						borderColor: "transparent",
						padding: "8px",
					}}
					onClick={() => handleClick("userProfile")}
					className={`text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray`}
				>
					<MdOutlineCancel />
				</button>
			</div>
			<div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
				<img
					className="rounded-full h-20 w-20"
					src={user.picture || svg}
					referrerPolicy="no-referrer"
					alt="user-profile"
				/>
				<div style={{ maxWidth: "100%", overflow: "hidden" }}>
					<p className="font-semibold text-xl dark:text-gray-200">
						{" "}
						{user.name}{" "}
					</p>
					<p className="text-gray-500 text-sm dark:text-gray-400">
						{" "}
						Administrator{" "}
					</p>
					<p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
						{" "}
						{user.email}{" "}
					</p>
				</div>
			</div>
			<div>
				{userProfileData.map((item, index) => (
					<div
						key={index}
						className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
					>
						<button
							type="button"
							style={{
								color: item.iconColor,
								backgroundColor: item.iconBg,
							}}
							className=" text-xl rounded-lg p-3 hover:bg-light-gray"
						>
							{item.icon}
						</button>

						<div>
							<p className="font-semibold dark:text-gray-200 ">
								{item.title}
							</p>
							<p className="text-gray-500 text-sm dark:text-gray-400">
								{" "}
								{item.desc}{" "}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="mt-5">
				{/* <Button color="white" bgColor={currentColor} text="Logout" borderRadius="10px" width="full" /> */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						handleLogout();
					}}
					style={{
						backgroundColor: currentColor,
						color: "white",
						borderRadius: "10px",
						width: "full",
					}}
					className={`  p-3 w-full hover:drop-shadow-xl`}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
