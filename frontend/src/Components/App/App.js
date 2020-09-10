import React, { Component } from "react";
import Header from '../Header/Header';
import Search from '../Search/Search';
import Product from '../Product/Product';
import Main from '../Main/Main';
import Order from '../Order/Order';
import Checkout from '../Checkout/Checkout';
import CreditCard from '../Checkout/CreditCard';
import {defaults} from '../../config/defaults'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import './App.css';

class App extends Component {

	constructor(props) {

		super(props);
		this.state = {
			current: "main",
			item: "",
			productsCart: [],
			order_parsed: null,
			order_details: undefined,
		}
		this.getProductFromChildCallback = this.getProductFromChildCallback.bind(this);
		this.getProductsFromOrderCallback = this.getProductsFromOrderCallback.bind(this);
		this.getUpdatedCart = this.getUpdatedCart.bind(this);
		this.getCurrentPage = this.getCurrentPage.bind(this);
	}

	notify() {
		toast("Wow so easy !");
	}

	// returns a new element (the one that should be displayed)
	map_components(str_) {
		switch (str_) {
			case "product":
				return <Product callbackCurrentPage={this.getCurrentPage} item={this.state.item} callbackFromParent={this.getProductsFromOrderCallback} AppState={this.state} />
			case "cart":
				return <div className="order-page"><Order callbackCurrentPage={this.getCurrentPage} orderItems={this.state.productsCart} callbackFromParent={this.getUpdatedCart} type="cart" AppState={this.state} /></div>
			case "checkout":
				return <Checkout callbackCurrentPage={this.getCurrentPage} productsCart={this.state.productsCart} order_details={this.state.order_details} callbackFromParent={this.getUpdatedCart} callbackOrder={this.getUpdatedCart} AppState={this.state} />
			case "search":
				return <Search callbackCurrentPage={this.getCurrentPage} item={this.state.item} callbackFromParent={this.getProductFromChildCallback} AppState={this.state} />
			default:
				return <Main callbackCurrentPage={this.getCurrentPage} AppState={this.state} />
		}
	}

	//callback to obtain the order details.
	getProductsFromOrderCallback(productsFromOrder) {
		let prods = [...this.state.productsCart, productsFromOrder];
		this.setState({ productsCart: prods });
	}

	getUpdatedCart(products, details) {
		this.setState({ productsCart: products, order_details: details });
	}

	//callback to obtain the product that was selected by the user.
	getProductFromChildCallback(productFromChild) {
		this.setState({ item: productFromChild });
	}

	//updates the current element the one that should be displayed in the rendering that will follow. 
	getCurrentPage(currentPage) {
		if (this.state.current != currentPage) {
			this.setState({ current: currentPage });
		}
	}


	render() {

		//       alert(JSON.stringify(this.state));
		return (
			<div>
				<Header callbackCurrentPage={this.getCurrentPage} item={this.state.item} AppState={this.state} />
				{this.map_components(this.state.current)}
			</div>
		);
	}
}

export default App;

