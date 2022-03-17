import React, { Component } from "react";
import "./Navbar.scoped.scss";

export default class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = { current: props.current };
	}
	render() {
		return (
			<>
				<div id="navbar">
					<div className="pages">
						{this.props.items.map((item, index) => {
							let classname = "item";
							if (item.length == 3) {
								classname += ` ${item[2]}`;
							}
							if (index == this.props.current) {
								classname += " current";
							}
							return (
								<div
									className={classname}
									key={index}
									onClick={async () => {
										await item[1]();
										this.setState({ current: index });
									}}
								>
									{item[0]}
								</div>
							);
						})}
					</div>
					<div className="lside">
						{this.props.logged && (
							<div className="username">
								{this.props.username}
							</div>
						)}
						<div className="logo" />
					</div>
				</div>
				<div id="navspacer" />
			</>
		);
	}
}
