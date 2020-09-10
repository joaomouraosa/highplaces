import React, { Component } from "react";
import './Order.scss';
import { API_PATH, STATIC_PATH } from '../../config/defaults'


class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_parsed: null, //{2:1} //productID: quantity
            order_db: null,     //[{ productId: parseInt(x), quantity: order[x] },...]
            order_details: null,
            type: this.props.type
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
        this.setState({ order_parsed: JSON.parse(order_JSON) });
        this.fetch_order(order_JSON);
    }

    parseOrder(order_) {
        let order = {};
        order_.forEach(product => {
            if (order[product.id] != undefined)
                order[product.id] += parseInt(product.quantity);
            else
                order[product.id] = parseInt(product.quantity);
        });
        let res = [];
        Object.keys(order).forEach(x => res.push({ productId: parseInt(x), quantity: order[x] }));
        return JSON.stringify(res);
    }

    fetch_order(order) {
        fetch(API_PATH + "/order", {
            method: "POST",
            body: order,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => this.set_state(data, order))
            .catch(error => console.log(error));
    }

    set_state(data, order_JSON) {
        this.props.callbackFromParent(data.items, data.details);
        this.setState({
            order_db: data.items,
            order_parsed: JSON.parse(order_JSON),
            order_details: data.details
        });
    }

    remove_element(id) {
        const order_parsed = this.state.order_parsed.filter(el => el.productId != id);
        this.fetch_order(JSON.stringify(order_parsed));
    }

    update_count(e) {
        console.log("here");
        console.log(e);
        /*
        alert(e.currentTarget.value);
        const order_parsed = this.state.order_parsed.map((el) => {
            if (el.productId == id)
                el.quantity=e.currentTarget.value;
        });
        this.fetch_order(JSON.stringify(order_parsed));
        */
    }

    decrement_element(id) {
        const order_parsed = this.state.order_parsed.map((el) => {
            if (el.productId == id && el.quantity > 0)
                el.quantity -= 1;
            return el;
        });
        this.fetch_order(JSON.stringify(order_parsed));
    }

    increment_decrement(e, id) {
        console.log();
        const order_parsed = this.state.order_parsed.map((el) => {
            if (el.productId == id)
                el.quantity = e.target.value;
            return el;
        });
        this.fetch_order(JSON.stringify(order_parsed));
    }

    updatePage(page) {
        this.props.callbackCurrentPage(page);
    }

    //falta incorporar o total em condições
    render() {
        alert(JSON.stringify(this.state, null, 4));
        let elements = "";
        let elements2 = "";
        if (this.state.order_db != null) {
            elements = this.state.order_db.map(order =>
                <div class="product">
                    <div class="product-image"> <img src="https://s.cdpn.io/3/dingo-dog-bones.jpg" /> </div>
                    <div class="product-details">
                        <div class="product-title">{order.name}</div>
                        <p class="product-description">TODO description abcasdf asdf wef.</p>
                    </div>
                    <div class="product-price">{order.price}</div>
                    <div class="product-quantity">
                        <input type="number" value={order.quantity} min="1" onChange={(e) => this.increment_decrement(e, order.id)} />
                    </div>
                    <div class="product-removal">
                        <button class="remove-product" onClick={() => this.remove_element(order.id)}>Remove</button>
                    </div>
                    <div class="product-line-price">{order.total}</div>
                </div>
            );
/*
            elements2 = this.state.order_db.map(order =>
                <div class="product">
                    <div class="product-image"> <img src="https://s.cdpn.io/3/dingo-dog-bones.jpg" /> </div>
                    <div class="product-details">
                        <div class="product-title">{order.item.name}</div>
                        <p class="product-description">TODO description abcasdf asdf wef.</p>
                    </div>
                    <div class="product-price">{order.item.price}</div>
                    <div class="product-quantity">
                        <input type="number" value={order.item.quantity} min="1" onChange={(e) => this.increment_decrement(e, order.item.id)} />
                    </div>
                    <div class="product-removal">
                        <button class="remove-product" onClick={() => this.remove_element(order.item.id)}>Remove</button>
                    </div>
                    <div class="product-line-price">{order.item.total}</div>
                </div>
            );
*/

        }
        return (
            <div class="order" >
                <h2>Shopping Cart </h2>
                <div class="column-labels">
                    <label class="product-image">Image</label>
                    <label class="product-details">Product</label>
                    <label class="product-price">Price</label>
                    <label class="product-quantity">Quantity</label>
                    <label class="product-removal">Remove</label>
                    <label class="product-line-price">Total</label>
                </div>

                {elements}


                <div class="totals">
                    <div class="totals-value" id="cart-total"> <label>Total</label>
                        {(this.state.order_details == null) ? "" : this.state.order_details.total}</div>
                </div>
                {this.state.type == "cart" && <button id="continue_shopping_btn" onClick={() => { alert("clicked"); this.updatePage("main") }}>Continue Shopping</button>}
                {this.state.type == "cart" && <button class="checkout" onClick={() => { this.updatePage("checkout") }}>Proceed to Checkout</button>}
            </div >


            /*
                        <div className="order">
                            <table>
                                <tr>
                                    <th>Product</th>  <th>Description</th>  <th>Availability</th>  <th>Unit price</th>  <th>Quantity</th>  <th>Total</th>
                                </tr>
                                {elements}
                                total: {(this.state.order_details == null) ? "" : this.state.order_details.total}
                            </table>
                            <button id="continue_shopping_btn" onClick={() => { alert("clicked"); this.updatePage("main") }}>Continue Shopping</button>
                            <button id="proceed_checkout" onClick={() => { this.updatePage("checkout") }}>Proceed to Checkout</button>
            
                        </div>
            */
        );
    }
}
export default Order;
