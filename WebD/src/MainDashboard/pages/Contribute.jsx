import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Page,
	Selection,
	Inject,
	Edit,
	Toolbar,
	Sort,
	Filter,
} from "@syncfusion/ej2-react-grids";

import { customersData, customersGrid } from "../data/dummy";
import React, { useContext, useState } from "react";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Contribute = () => {
	const selectionsettings = { persistSelection: true };
	const toolbarOptions = ["Delete"];
	const editing = { allowDeleting: true, allowEditing: true };
	const { isSubmitted, handleSubmit } = useStateContext();

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
			<h1>Partner with Us</h1>
			{isSubmitted ? (
				<p
					style={{
						fontSize: "20px",
						fontWeight: "bold",
						textAlign: "center",
					}}
				>
					Your model is under review by our team. Hang on tight!
				</p>
			) : (
				<form
					className="w-full max-w-lg mx-auto mt-5"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-wrap -mx-3 mb-6">
						<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
							<label
								className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
								htmlFor="grid-first-name"
							>
								First Name
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
								id="grid-first-name"
								type="text"
								placeholder="Jane"
							/>
						</div>
						<div className="w-full md:w-1/2 px-3">
							<label
								className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
								htmlFor="grid-last-name"
							>
								Last Name
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
								id="grid-last-name"
								type="text"
								placeholder="Doe"
							/>
						</div>
					</div>
					<div className="flex flex-wrap -mx-3 mb-6">
						<div className="w-full px-3">
							<label
								className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
								htmlFor="grid-email"
							>
								Email
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
								id="grid-email"
								type="email"
								placeholder="jane.doe@example.com"
							/>
						</div>
					</div>
					<div className="flex flex-wrap -mx-3 mb-6">
						<div className="w-full px-3">
							<label
								className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
								htmlFor="grid-github-repo"
							>
								GitHub Repo of Your Model
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
								id="grid-github-repo"
								type="text"
								placeholder="https://github.com/username/repo"
							/>
						</div>
					</div>
					<div className="md:flex md:items-center">
						<div className="md:w-1/3">
							<button
								className="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
								type="submit"
							>
								Submit
							</button>
						</div>
						<div className="md:w-2/3"></div>
					</div>
				</form>
			)}
		</div>
	);
};

export default Contribute;
