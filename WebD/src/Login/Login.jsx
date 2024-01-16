import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";

const Login = () => {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="mb-4">Login Auth0</h1>
			<div className="mb-4">
				<LoginButton />
				<Profile />
			</div>
			<LogoutButton />
		</main>
	);
};

export default Login;
