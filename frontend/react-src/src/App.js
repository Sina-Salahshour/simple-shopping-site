import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import Login from "./components/Login/Login";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import UserPanel from "./components/UserPanel/UserPanel";
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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logged: false,
			currentPage: 0,
			token: null,
			refresh: null,
		};
		this.logingHandler = this.logingHandler.bind(this);
		this.apvpost = this.apvpost.bind(this);
		this.apvget = this.apvget.bind(this);
		this.apost = this.apost.bind(this);
		this.aget = this.aget.bind(this);
		this.setPage = this.setPage.bind(this);
		this.islogged = this.islogged.bind(this);
		this.items = [
			[
				"خانه",
				() => {
					this.setPage(0);
					return 0;
				},
			],
			[
				"محصولات",
				() => {
					this.setPage(1);
					return 0;
				},
			],
		];
		this.loggedItems = [
			[
				[
					"ورود",
					async () => {
						this.setPage(2);
						return 0;
					},
					"login",
				],
				[
					"ثبت نام",
					async () => {
						this.setPage(3);
						return 0;
					},
					"signup",
				],
			],
			[
				[
					"سبد خرید",
					async () => {
						this.setPage(2);
						return 0;
					},
				],
				[
					"خروج",
					async () => {
						this.logout();
						return 0;
					},
					"signup",
				],
			],
		];
		this.pages = [
			<Home />,
			<Products
				getHandler={this.aget}
				postHandler={this.apost}
				pvpostHandler={this.apvpost}
				logged={this.islogged}
			/>,
		];
		this.loggedPages = [
			[
				<Login type={"login"} handler={this.logingHandler} />,
				<Login
					type="signUp"
					handler={() => {
						this.setPage(0);
					}}
				/>,
			],
			[
				<ShoppingList
					logged={this.islogged}
					pvpost={this.apvpost}
					pvget={this.apvget}
				/>,
				<UserPanel />,
			],
		];
	}
	async setPage(num) {
		this.setState({ currentPage: num });
		window.localStorage.setItem("currentPage", num);
	}
	logout() {
		window.localStorage.clear();
		window.location.reload();
	}
	islogged() {
		return this.state.logged;
	}
	async apvpost(url, data = {}, headers = {}, second = false) {
		let res;
		let tmp;
		try {
			res = await axios.post(url, data, {
				headers: {
					...headers,
					"X-CSRFToken": csrftoken,
					Authorization: `Bearer ${this.state.token}`,
				},
				mode: "same-origin",
			});
		} catch (err) {
			if (err.response.status != 401) throw err;
			try {
				tmp = await axios.post(
					"/api/token/refresh/",
					{
						refresh: this.state.refresh,
					},
					{
						headers: {
							"X-CSRFToken": csrftoken,
						},
						mode: "same-origin",
					}
				);
				this.setState({
					token: tmp.data.access,
					refresh: tmp.data.refresh,
				});
			} catch (err) {
				if (err.response.status != 401) throw err;
				this.logout();
			}
			if (!second) {
				return await this.apvpost(url, data, headers, true);
			}
		}
		return res;
	}
	async apost(url, data = {}, headers = {}) {
		let res;
		res = await axios.post(url, data, {
			headers: {
				...headers,
				"X-CSRFToken": csrftoken,
			},
			mode: "same-origin",
		});
		return res;
	}
	async aget(url, headers = {}) {
		let res;
		res = await axios.get(url, {
			headers: {
				...headers,
				"X-CSRFToken": csrftoken,
			},
			mode: "same-origin",
		});
		return res;
	}
	async apvget(url, headers = {}, second = false) {
		let res;
		let tmp;
		try {
			res = await axios.get(url, {
				headers: {
					...headers,
					"X-CSRFToken": csrftoken,
					Authorization: `Bearer ${this.state.token}`,
				},
				mode: "same-origin",
			});
		} catch (err) {
			if (err.response.status != 401) throw err;
			try {
				tmp = await axios.post(
					"/api/token/refresh/",
					{
						refresh: this.state.refresh,
					},
					{
						headers: {
							"X-CSRFToken": csrftoken,
						},
						mode: "same-origin",
					}
				);
				this.setState({
					token: tmp.data.access,
					refresh: tmp.data.refresh,
				});
			} catch (err) {
				if (err.response.status != 401) throw err;
				this.logout();
			}
			if (!second) {
				return await this.apvget(url, headers, true);
			}
		}
		return res;
	}
	componentDidMount() {
		let token = window.localStorage.getItem("token");
		let refresh = window.localStorage.getItem("refresh");
		let currentPage = window.localStorage.getItem("currentPage");
		if (token != null && refresh != null) {
			this.setState({
				token: token,
				refresh: refresh,
				logged: true,
				currentPage: currentPage || 0,
			});
			this.apvget("/api/test/").then((data) =>
				this.setState({ username: data.data })
			);
		}
	}
	logingHandler(token, refresh) {
		window.localStorage.setItem("token", token);
		window.localStorage.setItem("refresh", refresh);
		this.setState({
			logged: true,
			currentPage: 0,
			token: token,
			refresh: refresh,
		});
		this.apvget("/api/test/").then((data) =>
			this.setState({ username: data.data })
		);
	}
	render() {
		return (
			<div className="App">
				<Navbar
					items={[
						...this.items,
						...this.loggedItems[Number(this.state.logged)],
					]}
					current={this.state.currentPage}
					logged={this.state.logged}
					username={this.state.username}
				/>
				{
					[
						...this.pages,
						...this.loggedPages[Number(this.state.logged)],
					][this.state.currentPage]
				}
			</div>
		);
	}
}

export default App;
