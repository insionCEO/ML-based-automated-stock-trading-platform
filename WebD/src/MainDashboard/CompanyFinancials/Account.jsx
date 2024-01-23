import React, { Component } from "react";

class Account extends Component {
  displayAccount() {
    return this.props.account.map((el, index) => (
      <ul key={index}>
        {Object.entries(el).map(([key, value], innerIndex) => (
          <li key={innerIndex}>
            {key}: <b>{String(value)}</b>
          </li>
        ))}
      </ul>
    ));
  }

  render() {
    return <div>{this.displayAccount()}</div>;
  }
}

export default Account;
