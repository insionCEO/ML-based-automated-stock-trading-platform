import React, { useEffect, useState } from "react";
import { Header } from "../components";

const Employees = () => {
	const [data, setData] = useState({ news: [] });

	useEffect(() => {
		fetch("http://localhost:5000/news")
			.then((response) => response.json())
			.then((response) => setData(response))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl text-gray-200">
			<Header title="News" />
			{data.news.map((item, index) => (
				<div
					key={index}
					className="p-4 border-2 border-gray-200 rounded-lg mb-4"
				>
					<h2 className="font-bold text-xl mb-2">{item.headline}</h2>
					<p className="text-gray-100">{item.summary}</p>
					<p className="text-sm text-gray-200">
						Author: {item.author}
					</p>
					<p className="text-sm text-gray-200">
						Created At: {new Date(item.created_at).toLocaleString()}
					</p>
					<p className="text-sm text-gray-200">
						Updated At: {new Date(item.updated_at).toLocaleString()}
					</p>
					<p className="text-sm text-gray-200">
						Source: {item.source}
					</p>
					<p className="text-sm text-gray-200">
						Symbols: {item.symbols.join(", ")}
					</p>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						Read more
					</a>
				</div>
			))}
		</div>
	);
};

export default Employees;
