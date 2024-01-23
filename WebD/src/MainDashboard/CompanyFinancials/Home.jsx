import React, { Component } from "react";
import Navbar from "../components/Navbar";
import Stocks from "./Stock";
import alpacaAPI from "./Services/AlpacaAPI";
import Account from "./Account";
import { Collapse } from "react-bootstrap";

class Home extends Component {
	state = {
		previouslyRendered: false,
		positions: [],
		gotAccount: false,
		account: [],
		accOpen: false,
		posOpen: false,
	};

	getAccount = () => {
		this.setState({ accOpen: !this.state.accOpen });
		if (!this.state.gotAccount) {
			const result = alpacaAPI();
			result.getAccount().then((response) => {
				this.setState({ account: this.state.account.concat(response.data) });
				this.setState({ gotAccount: !this.state.gotAccount });
			});
		}
	};

	getPositions = () => {
		this.setState({ posOpen: !this.state.posOpen });
		if (!this.state.previouslyRendered) {
			const result = alpacaAPI();
			result.getPositions().then((response) => {
				this.setState({ positions: this.state.positions.concat(response.data.map((el) => el)) });
				this.setState({ previouslyRendered: !this.state.previouslyRendered });
			});
		}
	};

	render() {
		return (
			<div>
				<header>
					<Navbar />
				</header>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 10 }}>
					<div>
						<button className="btn btn-primary m-2" onClick={this.getAccount}>
							Get Account
						</button>

						<Collapse in={this.state.accOpen}>
							<div>
								<p style={this.props.style}>Account</p>
								<Account accountStyle={this.props.accountStyle} account={this.state.account} />
							</div>
						</Collapse>
					</div>

					<div>
						<button className="btn btn-primary m-2" onClick={this.getPositions}>
							Get Positions
						</button>

						<Collapse in={this.state.posOpen}>
							<div>
								<p style={this.props.style}>Current Positions</p>
								<Stocks
									positionsStyle={this.props.positionsStyle}
									dataStyle={this.props.dataStyle}
									positions={this.state.positions}
								/>
							</div>
						</Collapse>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
