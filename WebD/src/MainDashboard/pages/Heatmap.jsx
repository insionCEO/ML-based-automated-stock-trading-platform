// import React, { useEffect } from "react";

// const Heatmap = () => {
//   useEffect(() => {
//     const fetchData = async () => {
//       const options = {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           "APCA-API-KEY-ID": "PKZMNP63HL85U73H6BYY",
//           "APCA-API-SECRET-KEY":
//             "UoE2qOlDId6PIU0j08L5qOtH2tgZNYuFTf6RQ42J",
//         },
//       };

//       try {
//         const response = await fetch(
//           "https://paper-api.alpaca.markets/v2/account/portfolio/history?intraday_reporting=market_hours&pnl_reset=per_day",
//           options
//         );
//         const responseData = await response.json();
//         console.log("Response Data:", responseData);

//         // Extract relevant data
//         const timestamps = responseData.timestamp.map(
//           (ts) => new Date(ts * 1000)
//         );
//         const profitLoss = responseData.profit_loss.map((pl) => pl || 0);

//         // Organize data into a format suitable for Cal-HeatMap
//         const data = timestamps.reduce((acc, curr, idx) => {
//           const year = curr.getFullYear();
//           const week = getWeekNumber(curr);
//           const day = curr.getDay();
//           if (!acc[year]) acc[year] = {};
//           if (!acc[year][week]) acc[year][week] = {};
//           acc[year][week][day] = profitLoss[idx];
//           return acc;
//         }, {});

//         // Initialize Cal-HeatMap
//         const cal = new CalHeatMap();
//         cal.init({
//           itemSelector: "#heatmap",
//           data: data,
//           domain: "year",
//           subDomain: "x_day",
//           start: new Date(timestamps[0]),
//           cellSize: 20,
//           domainLabelFormat: "%Y",
//           subDomainTitleFormat: {
//             empty: "No data for {date}",
//             filled: "{count} {name} {connector} {date}",
//           },
//           range: 1,
//           displayLegend: true,
//           legend: [0, 10, 20, 30], // Adjust legend as needed
//           legendCellSize: 15,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Function to get week number
//   function getWeekNumber(date) {
//     const onejan = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(
//       ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
//     );
//   }

//   return <div id="heatmap"></div>;
// };

// export default Heatmap;

import React from "react";

const Heatmap = () => {
	return <div>Heatmap</div>;
};

export default Heatmap;
