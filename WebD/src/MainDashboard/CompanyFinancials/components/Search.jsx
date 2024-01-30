import React, { useContext, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { searchSymbol } from "../utils/api/stock-api";
import SearchResults from "./SearchResults";
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import StockContext from "../context/StockContext";

const Search = () => {
	const {
		activeMenu,
		themeSettings,
		setThemeSettings,
		currentColor,
		currentMode,
	} = useStateContext();

	const { stockSymbol, setStockSymbol } = useContext(StockContext);

	const [input, setInput] = useState("");
	const [bestMatches, setBestMatches] = useState([]);

	const updateBestMatches = async () => {
		try {
			if (input) {
				const { result } = await searchSymbol(input);
				setBestMatches(result || []);
			}
		} catch (error) {
			setBestMatches([]);
			console.error(error);
		}
	};

	const clear = () => {
		setInput("");
		setBestMatches([]);
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			updateBestMatches();
		}
	};

	const handleSearch = async () => {
		if (input.trim() !== "") {
			setStockSymbol(input.trim());
		}
	};

	return (
		<div
			className={`flex items-center my-4 border-2 rounded-md relative z-50 w-96 ${
				currentMode
					? "bg-gray-900 border-gray-800"
					: "bg-white border-neutral-200"
			}`}
		>
			<input
				type="text"
				value={input}
				className={`w-full px-4 py-2 focus:outline-none rounded-md ${
					currentMode ? "bg-gray-900" : null
				}`}
				placeholder="Search stock..."
				onChange={(event) => setInput(event.target.value)}
				onKeyPress={handleKeyPress}
			/>
			{input && (
				<button onClick={clear} className="m-1">
					<ImCross className="h-4 w-4 fill-gray-500" />
				</button>
			)}
			<button
				onClick={handleSearch} // Call handleSearch on button click
				className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-2 ring-indigo-400"
			>
				<FaSearch className="h-4 w-4 fill-gray-100" />
			</button>
			{input && bestMatches.length > 0 && (
				<SearchResults results={bestMatches} />
			)}
		</div>
	);
};

export default Search;
