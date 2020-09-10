import React, { Component } from "react";
import App from '../App/App'

class Order extends Component {
    constructor(props) {
        alert("constructor");
        super(props);
        this.state = {
            order_parsed: null, //{2:1} //productID: quantity
            order_db: null,     //[{ productId: parseInt(x), quantity: order[x] },...]
            order_original: this.props.orderItems,
        }
        this.parseOrder = this.parseOrder.bind(this);
        this.fetch_order = this.fetch_order.bind(this);
    }

    /*
    * first of all, we retrieve the list of items that were added to the cart, and we parse them in the form [ID:quantity,...]
    * then we update the current state with the parsed items and with the original list of items (that was passed as prop)
    * then we send the parsed items to the server, to fetch the order from the server, for consistency reasons.
    * fetched data is saved in the state (order_db). Fetched data is also recalculated to the same structure as the original, 
    * also stored in the state (order_original) and sent back to the App component (parent) for it to update it's state as well.
    */
    componentDidMount() {
        const order_JSON = this.parseOrder(this.props.orderItems)
        this.setState({ order_parsed: JSON.parse(order_JSON), order_original: this.props.orderItems });
        this.fetch_order(order_JSON);
    }

    redo_order(orders_db) {
        let result = [];
        for (let order of orders_db) {
            result.push(
                {
                    "item": {
                        "id": order.ID,
                        "name": order.productName,
                        "price": order.price,
                        "stock": order.stock
                    },
                    "quantity": order.quantity
                });
        }
        return result;
    }

    parseOrder(order_) {
        let order = {};
        order_.forEach(product => {
            if (order[product.item.id] != undefined)
                order[product.item.id] += parseInt(product.quantity);
            else
                order[product.item.id] = parseInt(product.quantity);
        });
        let res = [];
        Object.keys(order).forEach(x => res.push({ productId: parseInt(x), quantity: order[x] }));
        return JSON.stringify(res);
    }

    fetch_order(order) {
        fetch("http://localhost:5000/order", {
            method: "POST",
            body: order,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => this.set_state(data));
    }

    set_state(data) {
        let data_original = this.redo_order(data);
        this.props.callbackFromParent(data_original);
        this.setState({ order_db: data, order_original: data_original });
    }

    remove_element(id) {
        const order_parsed = this.state.order_parsed.filter(el => el.productId != id);
        this.setState({ order_parsed: order_parsed });
        this.fetch_order(JSON.stringify(order_parsed));
    }

    decrement_element(id) {
        const order_parsed = this.state.order_parsed.map((el) => {
            if (el.productId == id && el.quantity > 0) {
                el.quantity -= 1;
                return el;
            }
            return el;
        });
        this.setState({ order_parsed: order_parsed });
        this.fetch_order(JSON.stringify(order_parsed));
    }

    increment_element(id) {
        const order_parsed = this.state.order_parsed.map((el) => {
            if (el.productId) {
                el.quantity += 1;
                return el;
            }
            return el;
        });
        this.setState({ order_parsed: order_parsed });
        this.fetch_order(JSON.stringify(order_parsed));
    }

    updatePage(page) {
        this.props.callbackCurrentPage(page);
    }

    //falta incorporar o total em condições
    render() {
  //      alert(JSON.stringify(this.state, null, 4));
        
        let elements = "";
        if (this.state.order_db != null) {
            elements = this.state.order_db.map(order => 
                <tr id={order.ID}>
                    <th>{order.name}</th>
                    <th>TODO </th>
                    <th>TODO </th>
                    <th>{order.price}</th>
                    <th>{order.quantity}</th>
                    <th>{order.total}</th>
                    <th> <button id="remove" onClick={() => this.remove_element(order.ID)}>X</button></th>
                    <th> <button id="subtract" onClick={() => this.decrement_element(order.ID)}>-</button></th>
                    <th> <button id="add" onClick={() => this.increment_element(order.ID)}>+</button></th>
                </tr>
            );
            elements.pop(); //because it's also returned the total amount
     //       elements.pop(); //and the hash and the order_id as well, and
     //       elements.pop(); //we only want to display the items returned.
        }

        return (
            <div className="order">
                <table >
                    <tr>
                        <th>Product</th>  <th>Description</th>  <th>Availability</th>  <th>Unit price</th>  <th>Quantity</th>  <th>Total</th>
                    </tr>
                    {elements}
                </table>
                <button id="continue_shopping_btn" onClick={() => { alert("clicked"); this.updatePage("main") }}>Continue Shopping</button>
                <button id="proceed_checkout" onClick={() => { this.updatePage("checkout") }}>Proceed to Checkout</button>

            </div>
        );
    }
}
export default Order;
