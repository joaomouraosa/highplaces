import React, { Component } from "react";
import countries_json from '../resources/countries.json';
import Payment from '../Payment/Payment';
import Order from '../Order/Order';
import './Checkout.css';

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: "checkout",
            formControls: {},
            productsCart: this.props.productsCart,
            order_details: this.props.order_details
        }
        this.updatePage = this.updatePage.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    componentDidUpdate() {
        this.updatePage("checkout");
        //       alert(JSON.stringify(this.state, null, 4));
    }

    updatePage(page) {
        this.props.callbackCurrentPage(page);
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = (name === "create_an_account" ||
            name === "already_registered" ||
            name === "update_shipping") ? event.target.checked : event.target.value;

        this.setState({
            current: "checkout",
            formControls: {
                ...this.state.formControls,
                [name]: value
            }
        });
    }

    async fetch_login(email, password) {
        alert("fetch");
        let promise = await fetch("http://localhost:5000/login",
            {
                method: "POST",
                body: JSON.stringify({ "email": email, "password": password }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
        let response = await promise.json();

        let status_response = Object.keys(response)[0];

        if (status_response == "error")
            alert(response);

        //se a resposta nao for um erro, guardar os valores retornados e meter o estado como logged in.
        else {
            response = response["message"][0];
            let fields = Object.keys(response);

            let formControls = {};
            fields.forEach((field) => {
                formControls = { ...formControls, [field]: response[field] }
            });
            alert(JSON.stringify(this.state, null, 4));
            this.setState({
                ...this.state,
                formControls
            });
            alert(JSON.stringify(this.state, null, 4));

        }
    }

    clickHandler = event => {
        alert("click handler");
        const email = this.state.formControls.email;
        const password = this.state.formControls.password;

        if (email != undefined && password != undefined) {
            this.fetch_login(email, password);
        }
    }

    conv_lower(str_) {
        return str_.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "").replace(/ /g, "_");
    }

    buttonField(type, name, section) {
        const name_lower = (section != "") ? this.conv_lower(name) + "_" + section : this.conv_lower(name);
        const value = this.state.formControls[name_lower] == undefined ? '' : this.state.formControls[name_lower].value;
        return (
            <form>
                <label> {name}  <input type={type} name={name_lower} value={value} id={name_lower} onChange={this.changeHandler} onClick={this.clickHandler} />  </label>
            </form>
        );
    }

    formField(type, name, section) {
        const name_lower = (section != "") ? this.conv_lower(name) + "_" + section : this.conv_lower(name);
        const value = this.state.formControls[name_lower] == undefined ? '' : this.state.formControls[name_lower].value;
        alert("formfield");
        alert(value);
        return (
            <form> <label> {name}  <input type={type} name={name_lower} value={value} id={name_lower} onChange={this.changeHandler} />  </label> </form>
        );
    }

    getElements() {
        let elements = "";
        if (this.state.productsCart != null) {
            elements = this.state.productsCart.map(order =>
                <tr id={order.id}>
                    <th>{order.name}</th>
                    <th>TODO </th>
                    <th>TODO </th>
                    <th>{order.price}</th>
                    <th>{order.quantity}</th>
                    <th>{order.total}</th>
                </tr>
            );
        }
        return elements;
    }

    //fazer pedido POST ao servidor com email, password, e demais informação.
    //guardar os dados na base de dados
    //



    render() {
        alert(JSON.stringify(this.state, null, 4));
        //  alert(JSON.stringify(this.state, null, 4));

        const countries = require('../resources/countries.json');
        return (
            <div className="checkout">
                <div className="order_client_details">
                    <div className="personal_details">
                        <span> Your personal details: </span>
                        {this.formField("email", "E-mail", "")}
                        {this.formField("checkbox", "Already registered?", "")}
                        {(this.state.formControls.already_registered) && this.formField("password", "Password", "")}
                        {(this.state.formControls.already_registered) && this.buttonField("button", "Login", "")}
                        {this.formField("string", "First name", "")}
                        {this.formField("string", "Last name", "")}
                    </div>

                    <div className="delivery_details">
                        <span> Select your delivery address: </span>
                        {this.formField("string", "First name", "shipping")}
                        {this.formField("string", "Last name", "shipping")}
                        {this.formField("string", "Address line 1", "")}
                        {this.formField("string", "Address line 2", "")}
                        <label>Select Country:</label>   <select onChange={this.changeHandler}>{countries.map((obj) => { return <option value={obj.code}>{obj.name}</option> })}</select>
                        {this.formField("number", "Zip code", "")}
                        {this.formField("string", "City", "")}
                        {this.formField("string", "Mobile number", "")}
                    </div>

                    {(this.state.formControls.already_registered_personal) && this.formField("button", "update shipping information", "")}


                    {!this.state.formControls.already_registered && this.formField("checkbox", "Create an account", "")}
                    {(this.state.formControls.create_an_account) && this.formField("password", "Password", "")}
                    {(this.state.formControls.create_an_account) && this.formField("password", "Confirm password", "")}
                    {(this.state.formControls.create_an_account) && this.buttonField("button", "Register", "")}
                </div>

                <div className="payment_method">
                    <input type="radio" id="card" name="payment_method" value="Credit/debit card" onChange={this.changeHandler} checked="checked" /> <label for="card"> Credit/debit card </label>
                    <input type="radio" id="paypal" name="payment_method" value="PayPal" onChange={this.changeHandler} /> <label for="paypal">PayPal</label>
                    <input type="radio" id="transfer" name="payment_method" value="Bank Transfer" onChange={this.changeHandler} /> <label for="transfer">Bank Transfer</label>
                    <input type="radio" id="bitcoin" name="payment_method" value="Bitcoin" onChange={this.changeHandler} /> <label for="bitcoin">Bitcoin</label>

                </div>

                <div className="order_summary">

                    <div className="discount_code"></div>
                    <div className="add_comments"></div>
                </div>
                {this.getElements()}
                {this.state.order_details.total}
                <Payment />
                {/*         <Payment />*/}
            </div>
        );
    }
}


export default Checkout;