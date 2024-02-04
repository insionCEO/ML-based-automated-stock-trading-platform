import React from "react";
import {
	AiOutlineCalendar,
	AiOutlineShoppingCart,
	AiOutlineAreaChart,
	AiOutlineBarChart,
	AiOutlineStock,
} from "react-icons/ai";
import {
	FiShoppingBag,
	FiEdit,
	FiPieChart,
	FiBarChart,
	FiCreditCard,
	FiStar,
	FiShoppingCart,
} from "react-icons/fi";
import {
	BsKanban,
	BsBarChart,
	BsBoxSeam,
	BsCurrencyDollar,
	BsShield,
	BsChatLeft,
} from "react-icons/bs";
import { BiColorFill } from "react-icons/bi";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { TiTick } from "react-icons/ti";
import { GiLouvrePyramid } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import avatar from "./avatar.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.png";
import avatar4 from "./avatar4.jpg";
import product1 from "./product1.jpg";
import product2 from "./product2.jpg";
import product3 from "./product3.jpg";
import product4 from "./product4.jpg";
import product5 from "./product5.jpg";
import product6 from "./product6.jpg";
import product7 from "./product7.jpg";
import product8 from "./product8.jpg";

export const gridOrderImage = (props) => (
	<div>
		<img
			className="rounded-xl h-20 md:ml-3"
			src={props.ProductImage}
			alt="order-item"
		/>
	</div>
);

export const gridOrderStatus = (props) => (
	<button
		type="button"
		style={{ background: props.StatusBg }}
		className="text-white py-1 px-2 capitalize rounded-2xl text-md"
	>
		{props.Status}
	</button>
);

export const kanbanGrid = [
	{ headerText: "To Do", keyField: "Open", allowToggle: true },

	{
		headerText: "In Progress",
		keyField: "InProgress",
		allowToggle: true,
	},

	{
		headerText: "Testing",
		keyField: "Testing",
		allowToggle: true,
		isExpanded: false,
	},

	{ headerText: "Done", keyField: "Close", allowToggle: true },
];
const gridEmployeeProfile = (props) => (
	<div className="flex items-center gap-2">
		<img
			className="rounded-full w-10 h-10"
			src={props.EmployeeImage}
			alt="employee"
		/>
		<p>{props.Name}</p>
	</div>
);

const gridEmployeeCountry = (props) => (
	<div className="flex items-center justify-center gap-2">
		<GrLocation />
		<span>{props.Country}</span>
	</div>
);
export const EditorData = () => (
	<div>
		<h3>
			Try React React has been designed from the start for gradual
			adoption, and you can use as little or as much React as you
			need. Whether you want to get a taste of React, add some
			interactivity to a simple HTML page, or start a complex
			React-powered app, the links in this section will help you get
			started. Online Playgrounds If you’re interested in playing
			around with React, you can use an online code playground. Try a
			Hello World template on CodePen, CodeSandbox, or Stackblitz. If
			you prefer to use your own text editor, you can also download
			this HTML file, edit it, and open it from the local filesystem
			in your browser. It does a slow runtime code transformation, so
			we’d only recommend using this for simple demos. Add React to a
			Website You can add React to an HTML page in one minute. You
			can then either gradually expand its presence, or keep it
			contained to a few dynamic widgets. Create a New React App When
			starting a React project, a simple HTML page with script tags
			might still be the best option. It only takes a minute to set
			up! As your application grows, you might want to consider a
			more integrated setup. There are several JavaScript toolchains
			we recommend for larger applications. Each of them can work
			with little to no configuration and lets you take full
			advantage of the rich React ecosystem. Learn how. Learn React
			People come to React from different backgrounds and with
			different learning styles. Whether you prefer a more
			theoretical or a practical approach, we hope you’ll find this
			section helpful. If you prefer to learn by doing, start with
			our practical tutorial. If you prefer to learn concepts step by
			step, start with our guide to main concepts. Like any
			unfamiliar technology, React does have a learning curve. With
			practice and some patience, you will get the hang of it. First
			Examples The React homepage contains a few small React examples
			with a live editor. Even if you don’t know anything about React
			yet, try changing their code and see how it affects the result.
			React for Beginners If you feel that the React documentation
			goes at a faster pace than you’re comfortable with, check out
			this overview of React by Tania Rascia. It introduces the most
			important React concepts in a detailed, beginner-friendly way.
			Once you’re done, give the documentation another try! React for
			Designers If you’re coming from a design background, these
			resources are a great place to get started. JavaScript
			Resources The React documentation assumes some familiarity with
			programming in the JavaScript language. You don’t have to be an
			expert, but it’s harder to learn both React and JavaScript at
			the same time. We recommend going through this JavaScript
			overview to check your knowledge level. It will take you
			between 30 minutes and an hour but you will feel more confident
			learning React.
		</h3>
	</div>
);
const customerGridImage = (props) => (
	<div className="image flex gap-4">
		<img
			className="rounded-full w-10 h-10"
			src={props.CustomerImage}
			alt="employee"
		/>
		<div>
			<p>{props.CustomerName}</p>
			<p>{props.CustomerEmail}</p>
		</div>
	</div>
);

const customerGridStatus = (props) => (
	<div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
		<p
			style={{ background: props.StatusBg }}
			className="rounded-full h-3 w-3"
		/>
		<p>{props.Status}</p>
	</div>
);
export const areaPrimaryXAxis = {
	valueType: "DateTime",
	labelFormat: "y",
	majorGridLines: { width: 0 },
	intervalType: "Years",
	edgeLabelPlacement: "Shift",
	labelStyle: { color: "gray" },
};

export const areaPrimaryYAxis = {
	labelFormat: "{value}%",
	lineStyle: { width: 0 },
	maximum: 4,
	interval: 1,
	majorTickLines: { width: 0 },
	minorTickLines: { width: 0 },
	labelStyle: { color: "gray" },
};
export const barPrimaryXAxis = {
	valueType: "Category",
	interval: 1,
	majorGridLines: { width: 0 },
};
export const barPrimaryYAxis = {
	majorGridLines: { width: 0 },
	majorTickLines: { width: 0 },
	lineStyle: { width: 0 },
	labelStyle: { color: "transparent" },
};
const areaChartData = [
	[
		{ x: new Date(2002, 0, 1), y: 2.2 },
		{ x: new Date(2003, 0, 1), y: 3.4 },
		{ x: new Date(2004, 0, 1), y: 2.8 },
		{ x: new Date(2005, 0, 1), y: 1.6 },
		{ x: new Date(2006, 0, 1), y: 2.3 },
		{ x: new Date(2007, 0, 1), y: 2.5 },
		{ x: new Date(2008, 0, 1), y: 2.9 },
		{ x: new Date(2009, 0, 1), y: 3.8 },
		{ x: new Date(2010, 0, 1), y: 1.4 },
		{ x: new Date(2011, 0, 1), y: 3.1 },
	],
	[
		{ x: new Date(2002, 0, 1), y: 2 },
		{ x: new Date(2003, 0, 1), y: 1.7 },
		{ x: new Date(2004, 0, 1), y: 1.8 },
		{ x: new Date(2005, 0, 1), y: 2.1 },
		{ x: new Date(2006, 0, 1), y: 2.3 },
		{ x: new Date(2007, 0, 1), y: 1.7 },
		{ x: new Date(2008, 0, 1), y: 1.5 },
		{ x: new Date(2009, 0, 1), y: 2.8 },
		{ x: new Date(2010, 0, 1), y: 1.5 },
		{ x: new Date(2011, 0, 1), y: 2.3 },
	],
	[
		{ x: new Date(2002, 0, 1), y: 0.8 },
		{ x: new Date(2003, 0, 1), y: 1.3 },
		{ x: new Date(2004, 0, 1), y: 1.1 },
		{ x: new Date(2005, 0, 1), y: 1.6 },
		{ x: new Date(2006, 0, 1), y: 2 },
		{ x: new Date(2007, 0, 1), y: 1.7 },
		{ x: new Date(2008, 0, 1), y: 2.3 },
		{ x: new Date(2009, 0, 1), y: 2.7 },
		{ x: new Date(2010, 0, 1), y: 1.1 },
		{ x: new Date(2011, 0, 1), y: 2.3 },
	],
];

export const areaCustomSeries = [
	{
		dataSource: areaChartData[0],
		xName: "x",
		yName: "y",
		name: "USA",
		opacity: "0.8",
		type: "SplineArea",
		width: "2",
	},
	{
		dataSource: areaChartData[1],
		xName: "x",
		yName: "y",
		name: "France",
		opacity: "0.8",
		type: "SplineArea",
		width: "2",
	},
	{
		dataSource: areaChartData[2],
		xName: "x",
		yName: "y",
		name: "Germany",
		opacity: "0.8",
		type: "SplineArea",
		width: "2",
	},
];

export const barChartData = [
	[
		{ x: "USA", y: 46 },
		{ x: "GBR", y: 27 },
		{ x: "CHN", y: 26 },
	],
	[
		{ x: "USA", y: 37 },
		{ x: "GBR", y: 23 },
		{ x: "CHN", y: 18 },
	],
	[
		{ x: "USA", y: 38 },
		{ x: "GBR", y: 17 },
		{ x: "CHN", y: 26 },
	],
];

export const barCustomSeries = [
	{
		dataSource: barChartData[0],
		xName: "x",
		yName: "y",
		name: "Gold",
		type: "Column",
		marker: {
			dataLabel: {
				visible: true,
				position: "Top",
				font: { fontWeight: "600", color: "#ffffff" },
			},
		},
	},
	{
		dataSource: barChartData[1],
		xName: "x",
		yName: "y",
		name: "Silver",
		type: "Column",
		marker: {
			dataLabel: {
				visible: true,
				position: "Top",
				font: { fontWeight: "600", color: "#ffffff" },
			},
		},
	},
	{
		dataSource: barChartData[2],
		xName: "x",
		yName: "y",
		name: "Bronze",
		type: "Column",
		marker: {
			dataLabel: {
				visible: true,
				position: "Top",
				font: { fontWeight: "600", color: "#ffffff" },
			},
		},
	},
];
export const colorMappingData = [
	[
		{ x: "Jan", y: 6.96 },
		{ x: "Feb", y: 8.9 },
		{ x: "Mar", y: 12 },
		{ x: "Apr", y: 17.5 },
		{ x: "May", y: 22.1 },
		{ x: "June", y: 25 },
		{ x: "July", y: 29.4 },
		{ x: "Aug", y: 29.6 },
		{ x: "Sep", y: 25.8 },
		{ x: "Oct", y: 21.1 },
		{ x: "Nov", y: 15.5 },
		{ x: "Dec", y: 9.9 },
	],
	["#FFFF99"],
	["#FFA500"],
	["#FF4040"],
];

export const rangeColorMapping = [
	{
		label: "1°C to 10°C",
		start: "1",
		end: "10",
		colors: colorMappingData[1],
	},

	{
		label: "11°C to 20°C",
		start: "11",
		end: "20",
		colors: colorMappingData[2],
	},

	{
		label: "21°C to 30°C",
		start: "21",
		end: "30",
		colors: colorMappingData[3],
	},
];

export const ColorMappingPrimaryXAxis = {
	valueType: "Category",
	majorGridLines: { width: 0 },
	title: "Months",
};

export const ColorMappingPrimaryYAxis = {
	lineStyle: { width: 0 },
	majorTickLines: { width: 0 },
	minorTickLines: { width: 0 },
	labelFormat: "{value}°C",
	title: "Temperature",
};

export const FinancialPrimaryXAxis = {
	valueType: "DateTime",
	minimum: new Date("2016, 12, 31"),
	maximum: new Date("2017, 9, 30"),
	crosshairTooltip: { enable: true },
	majorGridLines: { width: 0 },
};

export const FinancialPrimaryYAxis = {
	title: "Price",
	minimum: 100,
	maximum: 180,
	interval: 20,
	lineStyle: { width: 0 },
	majorTickLines: { width: 0 },
};

export const LinePrimaryXAxis = {
	valueType: "DateTime",
	labelFormat: "y",
	intervalType: "Years",
	edgeLabelPlacement: "Shift",
	majorGridLines: { width: 0 },
	background: "white",
};

export const LinePrimaryYAxis = {
	labelFormat: "{value}%",
	rangePadding: "None",
	minimum: 0,
	maximum: 100,
	interval: 20,
	lineStyle: { width: 0 },
	majorTickLines: { width: 0 },
	minorTickLines: { width: 0 },
};

export const customersGrid = [
	{ type: "checkbox", width: "50" },
	{
		headerText: "Name",
		width: "150",
		template: customerGridImage,
		textAlign: "Center",
	},
	{
		field: "ProjectName",
		headerText: "Project Name",
		width: "150",
		textAlign: "Center",
	},
	{
		field: "Status",
		headerText: "Status",
		width: "130",
		format: "yMd",
		textAlign: "Center",
		template: customerGridStatus,
	},
	{
		field: "Weeks",
		headerText: "Weeks",
		width: "100",
		format: "C2",
		textAlign: "Center",
	},
	{
		field: "Budget",
		headerText: "Budget",
		width: "100",
		format: "yMd",
		textAlign: "Center",
	},

	{
		field: "Location",
		headerText: "Location",
		width: "150",
		textAlign: "Center",
	},

	{
		field: "CustomerID",
		headerText: "Customer ID",
		width: "120",
		textAlign: "Center",
		isPrimaryKey: true,
	},
];

export const employeesGrid = [
	{
		headerText: "Employee",
		width: "150",
		template: gridEmployeeProfile,
		textAlign: "Center",
	},
	{ field: "Name", headerText: "", width: "0", textAlign: "Center" },
	{
		field: "Title",
		headerText: "Designation",
		width: "170",
		textAlign: "Center",
	},
	{
		headerText: "Country",
		width: "120",
		textAlign: "Center",
		template: gridEmployeeCountry,
	},

	{
		field: "HireDate",
		headerText: "Hire Date",
		width: "135",
		format: "yMd",
		textAlign: "Center",
	},

	{
		field: "ReportsTo",
		headerText: "Reports To",
		width: "120",
		textAlign: "Center",
	},
	{
		field: "EmployeeID",
		headerText: "Employee ID",
		width: "125",
		textAlign: "Center",
	},
];

export const links = [
	{
		title: "Dashboard",
		links: [
			{
				name: "dashboard",
				icon: <FiShoppingBag />,
			},
		],
	},

	{
		title: "Profile",
		links: [
			{
				name: "profile",
				icon: <IoMdContacts />,
			},
			{
				name: "heatmap",
				icon: <FiPieChart />,
			},
			{
				name: "positions",
				icon: <RiContactsLine />,
			},
			{
				name: "orders",
				icon: <AiOutlineShoppingCart />,
			},
		],
	},
	// {
	//   title: 'Apps',
	//   links: [
	//     {
	//       name: 'calendar',
	//       icon: <AiOutlineCalendar />,
	//     },
	//     {
	//       name: 'kanban',
	//       icon: <BsKanban />,
	//     },
	//     {
	//       name: 'editor',
	//       icon: <FiEdit />,
	//     },
	//     {
	//       name: 'color-picker',
	//       icon: <BiColorFill />,
	//     },
	//   ],
	// },
	{
		title: "Charts",
		links: [
			// {
			//   name: "line",
			//   icon: <AiOutlineStock />,
			// },
			// {
			//   name: "area",
			//   icon: <AiOutlineAreaChart />,
			// },

			{
				name: "news",
				icon: <AiOutlineBarChart />,
			},

			{
				name: "financials",
				icon: <RiStockLine />,
			},
			{
				name: "shop",
				icon: <BsBarChart />,
			},
			{
				name: "sentiment",
				icon: <GiLouvrePyramid />,
			},
		],
	},
	{
		title: "Contribute",
		links: [
			{
				name: "contribute",
				icon: <AiOutlineBarChart />,
			},
		],
	},
];

export const cartData = [
	{
		image: product5,
		name: "butterscotch ice-cream",
		category: "Milk product",
		price: "$250",
	},
	{
		image: product6,
		name: "Supreme fresh tomato",
		category: "Vegetable Item",
		price: "$450",
	},
	{
		image: product7,
		name: "Red color candy",
		category: "Food Item",
		price: "$190",
	},
];

export const themeColors = [
	{
		name: "blue-theme",
		color: "#1A97F5",
	},
	{
		name: "green-theme",
		color: "#03C9D7",
	},
	{
		name: "purple-theme",
		color: "#7352FF",
	},
	{
		name: "red-theme",
		color: "#FF5C8E",
	},
	{
		name: "indigo-theme",
		color: "#1E4DB7",
	},
	{
		color: "#FB9678",
		name: "orange-theme",
	},
];

export const userProfileData = [
	{
		icon: <BsCurrencyDollar />,
		title: "My Profile",
		nav: "/dashboardv2/Profile",
		desc: "Account Settings",
		iconColor: "#03C9D7",
		iconBg: "#E5FAFB",
	},
];

export const ordersGrid = [
	{
		headerText: "Image",
		template: gridOrderImage,
		textAlign: "Center",
		width: "120",
	},
	{
		field: "OrderItems",
		headerText: "Item",
		width: "150",
		editType: "dropdownedit",
		textAlign: "Center",
	},
	{
		field: "CustomerName",
		headerText: "Customer Name",
		width: "150",
		textAlign: "Center",
	},
	{
		field: "TotalAmount",
		headerText: "Total Amount",
		format: "C2",
		textAlign: "Center",
		editType: "numericedit",
		width: "150",
	},
	{
		headerText: "Status",
		template: gridOrderStatus,
		field: "OrderItems",
		textAlign: "Center",
		width: "120",
	},
	{
		field: "OrderID",
		headerText: "Order ID",
		width: "120",
		textAlign: "Center",
	},

	{
		field: "Location",
		headerText: "Location",
		width: "150",
		textAlign: "Center",
	},
];
