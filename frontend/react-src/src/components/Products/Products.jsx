import React, { useState, useLayoutEffect } from "react";
import "./Products.scoped.scss";

function Product(props) {
	const [count, setCount] = useState(1);
	return (
		<div className="product" key={props.product.id}>
			<h1 className="name">{props.product.name}</h1>
			<p className="details">{props.product.details}</p>
			<p className="price">
				<span className="pval">{props.product.price * count}</span>تومان
			</p>
			{(props.logged() && (
				<div className="buybox">
					<div
						className="addbtn"
						onClick={() => {
							if (count == 0) return;
							props.pvpostHandler("/api/products/add_to_cart/", {
								id: props.product.id,
								count: count,
							});
							setCount(0);
						}}
					>
						اضافه کردن به سبد خرید
					</div>
					<div className="counter">
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
									setCount((prev) =>
										prev > 1 ? prev - 1 : 1
									)
								}
							>
								-
							</div>
						</div>
					</div>
				</div>
			)) || <div className="loginfirst"> برای خرید وارد شوید</div>}
		</div>
	);
}

export default function Products(props) {
	const [products, setProducts] = useState([]);
	useLayoutEffect(() => {
		props.getHandler("/api/products/").then((data) => {
			setProducts(data.data);
		});
	}, []);

	return (
		<div id="products">
			{products.map((product) => {
				return (
					<Product
						product={product}
						logged={props.logged}
						pvpostHandler={props.pvpostHandler}
					/>
				);
			})}
		</div>
	);
}
