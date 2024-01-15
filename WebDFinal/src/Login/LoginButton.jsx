import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
	const { loginWithRedirect, isAuthenticated } = useAuth0();
	return (
		<>
			{!isAuthenticated && (
				<button
					type="button"
					className={`py-3 px-4 bg-black-gradient font-poppins font-medium text-[18px] text-dimWhite outline-none rounded-[10px]`}
					onClick={() => loginWithRedirect()}
				>
					Sign In
				</button>
			)}
		</>
	);
};

export default LoginButton;
