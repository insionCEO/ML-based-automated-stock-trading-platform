import React, { Component } from "react";

class Stocks extends Component {
	percentChange = (stock) => {
		return ((stock.current_price - stock.avg_entry_price) / stock.avg_entry_price).toFixed(2);
	};

	chooseColor(stock) {
		const stocks = this.props.positions;
		let value = "badge m-2 badge-";
		// returns true if change is positive, representing appreciation in value
		const asset = stocks[stocks.indexOf(stock)];
		asset.avg_entry_price < asset.current_price ? (value += "success") : (value += "danger");
		return value;
	}

	displayPositions() {
		const stocks = this.props.positions;
		return stocks.map((stock, index) => (
			<div key={index}>
				<li style={this.props.positionsStyle} className={this.chooseColor(stock)}>
					{stock.symbol}
				</li>
				<p style={this.props.dataStyle}>
					side: {stock.side}, current price: ${stock.current_price}, pct change: {this.percentChange(stock)}%
				</p>
			</div>
		));
	}

	render() {
		return (
			<div>
				<ul>{this.displayPositions()}</ul>
			</div>
		);
	}
}

export default Stocks;
