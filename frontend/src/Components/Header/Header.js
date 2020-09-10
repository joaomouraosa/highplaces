import React, { Component } from "react";
import './Header.css';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Search from "../Search/Search";

const header_items = ["Main", "Search Products", "Contact us"];

class Header extends Component {
    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.state = {
            search_button: false
        }
    }

    updatePage(current) {
        this.props.callbackCurrentPage(current);
    }

    onClickHandler(event, button) {
        if (button === "search products") {
            if (this.props.AppState.current != "search")
                this.updatePage("search")
            else
                this.updatePage("main")
        }
        else if (button === "about us") {
            this.updatePage("about")
        }
        else if (button === "main") {
            this.updatePage("main")
        }
    }

    render() {
        const listItems = header_items.map((item) =>
            <li>
                <a href={"#"} onClick={(e) => { this.onClickHandler(e, item.toLowerCase()) }}>{item} </a>
            </li>);

        //const style = { float: "right" }
        const style = { float: "right" }

        if (this.props.productsCart != undefined) this.props.productsCart.timestamp = Math.floor(Date.now() / 1000);

        return (
            <>
                <div className="header">
                    <ul>
                        {listItems}
                        <li id="cart" style={style}><a href="#" onClick={() => this.updatePage("cart")}> Shopping Cart  </a> </li>
                    </ul>
                </div>
            </>
        );
    }
}

export default Header;
