import React, {
	useEffect,
	useState,
	memo,
	useCallback,
} from "react";
import { Header } from "../components";
import HashLoader from "react-spinners/HashLoader";

const Loader = () => (
	<div className="flex flex-col items-center justify-center h-full">
		<HashLoader className="" color="#79E6EA" size={60} />
		<p className="mt-8 text-white text-2xl font-semibold animate-pulse">
			Loading...
		</p>
	</div>
);

const NewsItem = memo(({ item }) => {
	const {
		headline,
		summary,
		author,
		created_at,
		updated_at,
		source,
		symbols,
		url,
		images,
	} = item;

	return (
		<div className="p-4 border-2 border-gray-200 rounded-lg mb-4 flex">
			<div className="flex-grow">
				<h2 className="font-bold text-xl mb-2">{headline}</h2>
				<p className="text-gray-100">{summary}</p>
				<p className="text-sm text-gray-200">Author: {author}</p>
				<p className="text-sm text-gray-200">
					Created At: {new Date(created_at).toLocaleString()}
				</p>
				<p className="text-sm text-gray-200">
					Updated At: {new Date(updated_at).toLocaleString()}
				</p>
				<p className="text-sm text-gray-200">Source: {source}</p>
				<p className="text-sm text-gray-200">
					Symbols: {symbols.join(", ")}
				</p>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:underline"
				>
					Read more
				</a>
			</div>
			{images &&
				images
					.filter((image) => image.size === "thumb")
					.map((image, i) => (
						<img
							key={i}
							src={image.url}
							alt={headline}
							className="ml-4"
						/>
					))}
		</div>
	);
});

const News = () => {
	const [data, setData] = useState({ news: [] });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch("http://localhost:5000/news");
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const { news } = await response.json();
			setData({ news });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-secondary-dark-bg rounded-3xl text-gray-200">
			<Header title="News" />
			{loading ? (
				<Loader />
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : (
				data.news.map((item, index) => (
					<NewsItem key={index} item={item} />
				))
			)}
		</div>
	);
};

export default News;
