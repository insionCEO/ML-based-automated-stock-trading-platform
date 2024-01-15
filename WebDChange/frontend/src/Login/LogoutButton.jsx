import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
	const { logout, isAuthenticated } = useAuth0();
	return (
		<>
			{isAuthenticated && (
				<button
					className={`py-3 px-4 bg-black-gradient font-poppins font-medium text-[18px] text-dimWhite outline-none rounded-[10px]`}
					onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
				>
					Sign Out
				</button>
			)}
		</>
	);
};

export default LogoutButton;
