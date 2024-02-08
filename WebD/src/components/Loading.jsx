import React from "react";
import { HashLoader } from "react-spinners";

const Loading = () => {
	return (
		<div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
			<HashLoader className="" color="#79E6EA" size={100} />
			<p className="mt-8 text-2xl font-semibold animate-pulse">
				Loading...
			</p>
		</div>
	);
};

export default Loading;
