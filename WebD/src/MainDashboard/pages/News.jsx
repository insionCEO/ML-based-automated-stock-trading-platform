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
		<div className="p-6 bg-main-dark-bg border border-gray-700 rounded-xl mb-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
			{images &&
				images
					.filter((image) => image.size === "thumb")
					.slice(0, 1)
					.map((image, i) => (
						<div key={i} className="mb-4 w-full h-48 overflow-hidden rounded-lg">
							<img
								src={image.url}
								alt={headline}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
			<div className="flex-grow">
				<h2 className="font-bold text-2xl mb-3 text-gray-100 line-clamp-2">{headline}</h2>
				<p className="text-gray-300 mb-4 line-clamp-3">{summary}</p>
				<div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
					<p>Author: {author}</p>
					<p>Source: {source}</p>
					<p>Created: {new Date(created_at).toLocaleString()}</p>
					<p>Updated: {new Date(updated_at).toLocaleString()}</p>
				</div>
				<p className="text-sm text-gray-400 mb-4">
					Symbols: {symbols.join(", ")}
				</p>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
				>
					Read more
				</a>
			</div>
		</div>
	);
});

const News = () => {
	const [data, setData] = useState({ news: [] });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch("https://tensorforce-backend.onrender.com/news");
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
				<div className="text-red-500 p-4 bg-red-100 rounded-lg">{error}</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{data.news.map((item, index) => (
						<NewsItem key={index} item={item} />
					))}
				</div>
			)}
		</div>
	);
};

export default News;
