import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import logo from "./img/shopping.png";

ReactDOM.render(
	<React.StrictMode>
		<link rel="shortcut icon" href={logo} type="image/x-icon" />
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
