import React, { useEffect } from "react";
import "./Login.scoped.scss";
import axios from "axios";

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === name + "=") {
				cookieValue = decodeURIComponent(
					cookie.substring(name.length + 1)
				);
				break;
			}
		}
	}
	return cookieValue;
}
const csrftoken = getCookie("csrftoken");

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null,
			email: null,
			error: null,
		};
	}
	componentDidMount() {
		this.setState({
			username: "",
			password: "",
			email: "",
			error: null,
		});
	}
	render() {
		if (this.props.type === "login") {
			return (
				<div id="login">
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							if (this.state.username && this.state.password) {
								axios
									.post(
										"/api/token/",
										{
											username: this.state.username,
											password: this.state.password,
										},
										{
											headers: {
												"X-CSRFToken": csrftoken,
											},
											mode: "same-origin",
										}
									)
									.then(({ data }) => {
										this.setState({
											username: null,
											password: null,
										});
										this.props.handler(
											data.access,
											data.refresh
										);
									})
									.catch(({ response }) => {
										this.setState({
											error: response.data.detail,
										});
									});
							}
						}}
					>
						{this.state.error != null && (
							<div
								className="error"
								onClick={() => this.setState({ error: null })}
							>
								{this.state.error}
							</div>
						)}
						<input
							placeholder="نام کاربری"
							type="text"
							value={this.state.username}
							onChange={(e) => {
								this.setState({ username: e.target.value });
							}}
						/>
						<input
							placeholder="رمز عبور"
							type="password"
							value={this.state.password}
							onChange={(e) => {
								this.setState({ password: e.target.value });
							}}
						/>
						<input type="submit" value="ورود" />
					</form>
				</div>
			);
		} else {
			return (
				<div id="login">
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							if (
								this.state.username &&
								this.state.password &&
								this.state.email
							) {
								axios
									.post(
										"/api/signup/",
										{
											username: this.state.username,
											password: this.state.password,
											email: this.state.email,
										},
										{
											headers: {
												"X-CSRFToken": csrftoken,
											},
											mode: "same-origin",
										}
									)
									.then(({ data }) => {
										this.props.handler();
									})
									.catch(({ response }) => {
										this.setState({ error: response.data });
									});
							}
						}}
					>
						{this.state.error != null && (
							<div
								className="error"
								onClick={() => this.setState({ error: null })}
							>
								{this.state.error}
							</div>
						)}
						<input
							placeholder="نام کاربری"
							type="text"
							value={this.state.username}
							onChange={(e) => {
								this.setState({ username: e.target.value });
							}}
						/>
						<input
							placeholder="ایمیل"
							type="email"
							value={this.state.email}
							onChange={(e) => {
								this.setState({ email: e.target.value });
							}}
						/>
						<input
							placeholder="رمز عبور"
							type="password"
							value={this.state.password}
							onChange={(e) => {
								this.setState({ password: e.target.value });
							}}
						/>
						<input type="submit" value="ثبت نام" />
					</form>
				</div>
			);
		}
	}
}
