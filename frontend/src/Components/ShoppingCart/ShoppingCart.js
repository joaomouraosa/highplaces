import React, { Component } from "react";

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            products: [],
            lastTimestamp: -1,
            order: {}
        }
        this.handleClick = this.handleClick.bind(this);
        this.parseOrder = this.parseOrder.bind(this);
    }

    parseOrder(order_) {
        alert("parse");
        alert(JSON.stringify(order_, null, 4));
        let order = {};
        order_.forEach(product => {
            let id = product.item.id;
            if (order[id] != undefined)
                order[id] += parseInt(product.quantity);
            else {
                order[id] = parseInt(product.quantity);
            }
        });
        return order;
    }

    componentDidUpdate() {
        if (this.props.productsCart != undefined && (this.state.lastTimestamp != this.props.productsCart.timestamp)) {
            let prods = [...this.state.products, this.props.productsCart];
            this.setState(
                {
                    lastTimestamp: this.props.productsCart.timestamp,
                    products: prods,
                    order: this.parseOrder(prods)
                }
            );
            alert("order");
            alert(JSON.stringify(this.state.order, null, 4));

        }
    }


    handleClick() {
        this.setState({ clicked: !this.state.clicked });
        alert(JSON.stringify(this.state.order, null, 4));
    }

    render() {
        return (
            <div>
                <ul><li><a href="#" onClick={this.handleClick}> Shopping cart</a></li></ul>
                {this.state.clicked ? <Order order={this.state.order} /> : null}
            </div>
        );
    }
}

class Order extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        alert(JSON.stringify(this.props, null, 4));

        const keys = Object.keys(this.props.order);
        const elements = keys.map(key =>
            <tr>
                <th>{key}</th>
                <th>{this.props.order[key]}</th>
            </tr>
        );

        return (
            <div className="order">
                {alert(JSON.stringify(this.props, null, 4))}
                <table >
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                    </tr>
                    <tr>
                        {elements}
                    </tr>
                </table>

            </div>
        );
    }
}


export default ShoppingCart;


