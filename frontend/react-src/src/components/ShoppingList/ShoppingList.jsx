import React, { useState, useLayoutEffect, useEffect } from "react";
import "./ShoppingList.scoped.scss";

function Item(props) {
	const [count, setCount] = useState(props.order[2]);
	return (
		<div className="order" key={props.order[0]}>
			<div className="name">{props.order[1]}</div>
			<div className="actions">
				<div className="counter" key={props.order[0]}>
					<div className="val">{count}</div>
					<div className="btns">
						<div
							className="up btn"
							onClick={() => setCount((prev) => prev + 1)}
						>
							+
						</div>
						<div
							className="down btn"
							onClick={() =>
								setCount((prev) => (prev > 1 ? prev - 1 : 1))
							}
						>
							-
						</div>
					</div>
				</div>
				<div className="totalprice">
					<span className="pval">{props.order[3] * count}</span>تومان
				</div>
				<div
					className="save"
					onClick={() => props.save_changes(props.order[0], count)}
				/>
				<div
					className="delete"
					onClick={() => props.delete_order(props.order[0])}
				/>
			</div>
		</div>
	);
}

export default function ShoppingList(props) {
	const [orders, setOrders] = useState([]);
	const [edited, setEdited] = useState(false);
	const delete_order = async (id) => {
		await props.pvpost("/api/user/orders/delete/", {
			id: id,
		});
		setEdited((prev) => !prev);
	};
	const save_changes = async (id, count) => {
		await props.pvpost("/api/user/orders/change/", {
			id: id,
			count: count,
		});
		setEdited((prev) => !prev);
	};
	useEffect(async () => {
		let tmp = [];
		let res = await props.pvget("/api/user/orders/");
		for (let item of res.data) {
			let rsp = await props.pvpost("/api/product/", {
				id: item.pointing_product,
			});
			tmp.push([rsp.data.id, rsp.data.name, item.count, rsp.data.price]);
		}
		setOrders(tmp);
	}, [edited]);
	if (orders.length == 0) return <div />;
	return (
		<div id="orders">
			{orders.map((order) => {
				return (
					<Item
						order={order}
						delete_order={delete_order}
						save_changes={save_changes}
					/>
				);
			})}
			<div className="order sumorders">
				<div className="name">جمع کل</div>
				<div className="totalprice">
					تومان
					<span className="pval">
						{(() => {
							let x = orders.reduce((a, b) => {
								return [1, 1, 1, a[3] * a[2] + b[3] * b[2]];
							});
							return x[2] * x[3];
						})()}
					</span>
				</div>
				<div className="buy" />
			</div>
		</div>
	);
}
