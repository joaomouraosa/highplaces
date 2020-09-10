import React, { Component } from "react";
import countries_json from '../resources/countries.json';
import Payment from '../Payment/Payment';
import Order from '../Order/Order';
import './Checkout.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreditCard from "./CreditCard";
import Bitcoin from "./Bitcoin";
import {API_PATH, STATIC_PATH} from '../../config/defaults'

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: "checkout",
            loggedIn: false,
            formControls: { payment_method: "" },
            productsCart: this.props.productsCart,
            order_details: this.props.order_details,
            create_an_account: false,
            already_registered: false
        }

        this.updatePage = this.updatePage.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }


    toastNotify(text, type) {
        toast.configure();
        let obj = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };

        switch (type) {
            case "success": toast.success(text, obj); return;
            case "warning": toast.warning(text, obj); return;
            case "error": toast.error(text, obj); return;
            default: toast.info(text, obj); return;
        }
    }

    componentDidUpdate() {
        this.updatePage("checkout");
    }

    updatePage(page) {
        this.props.callbackCurrentPage(page);
    }

    checkBoxCreateHandler = event => {
        this.setState({
            ...this.state,
            "create_an_account": !this.state.create_an_account,
            "already_registered": false

        });
    }

    checkBoxAlreadyHandler = event => {
        this.setState({
            ...this.state,
            "already_registered": !this.state.already_registered,
            "create_an_account": false
        });
    }

    changeHandler = event => {
        const name = event.target.name;
        this.setState({
            current: "checkout",
            formControls: {
                ...this.state.formControls,
                [name]: event.target.value
            }
        });
    }

    async fetch_update(email, password) {
        let promise = await fetch(API_PATH + "/update",
            {
                method: "POST",
                body: JSON.stringify({
                    "email": this.state.formControls.email,
                    "password": this.state.formControls.password,
                    "firstname": this.state.formControls.firstname,
                    "lastname": this.state.formControls.lastname,
                    "firstname_shipping": this.state.formControls.firstname_shipping,
                    "lastname_shipping": this.state.formControls.lastname_shipping,
                    "country": this.state.formControls.country,
                    "zip_code": this.state.formControls.zip_code,
                    "city": this.state.formControls.city,
                    "mobile_number": this.state.formControls.mobile_number,
                    "address_line_1": this.state.formControls.address_line_1,
                    "address_line_2": this.state.formControls.address_line_2
                }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
        let response = await promise.json();

        let status_response = Object.keys(response)[0];

        if (status_response == "error") {
            alert(JSON.stringify(response));
            this.toastNotify(response["error"], "error");
        }
        else {
            this.toastNotify("updated!", "success");
        }
    }

    async fetch_register(email, password) {
        let promise = await fetch(API_PATH + "/register",
            {
                method: "POST",
                body: JSON.stringify({
                    "email": this.state.formControls.email,
                    "password": this.state.formControls.password,
                    "firstname": this.state.formControls.firstname,
                    "lastname": this.state.formControls.lastname,
                    "firstname_shipping": this.state.formControls.firstname_shipping,
                    "lastname_shipping": this.state.formControls.lastname_shipping,
                    "country": this.state.formControls.country,
                    "zip_code": this.state.formControls.zip_code,
                    "city": this.state.formControls.city,
                    "mobile_number": this.state.formControls.mobile_number,
                    "address_line_1": this.state.formControls.address_line_1,
                    "address_line_2": this.state.formControls.address_line_2
                }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
        let response = await promise.json();

        let status_response = Object.keys(response)[0];

        if (status_response == "error") {
            this.toastNotify(response["error"], "error");
        }

        //se a resposta nao for um erro, fazer loggin.
        else {
            this.toastNotify("registered successfully", "success");

            response = response["message"][0];
            let fields = Object.keys(response);
            //       this.fetch_login(this.state.formControls.email,this.state.formControls.password);
        }
    }

    async fetch_login(email, password) {
        let promise = await fetch(API_PATH +  "/login",
            {
                method: "POST",
                body: JSON.stringify({ "email": email, "password": password }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
        let response = await promise.json();

        let status_response = Object.keys(response)[0];

        if (status_response == "error") {
            this.toastNotify(response["error"], "error");
        }

        //se a resposta nao for um erro, guardar os valores retornados e meter o estado como logged in.
        else {
            response = response["message"][0];
            let fields = Object.keys(response);

            let formControls = {};
            fields.forEach((field) => {
                formControls = { ...formControls, [field]: response[field] }
            });
            formControls = { ...formControls, "password": password };

            this.setState({
                ...this.state,
                loggedIn: true,
                formControls
            });
            this.toastNotify("logged in", "success");

        }
    }

    updateHandler = event => {
        const email = this.state.formControls.email;
        const password = this.state.formControls.password;

        if (email != undefined && password != undefined) {
            this.fetch_update(email, password);
        }
    }

    registerHandler = event => {

        //TODO: validate user_input
        const email = this.state.formControls.email;
        const password = this.state.formControls.register_password;
        const confirmP = this.state.formControls.confirm_password;

        const required = [
            "email", "firstname", "lastname", "firstname_shipping", "lastname_shipping", "country", "zip_code",
            "city", "mobile_number", "address_line_1", "register_password", "confirm_password"
        ];

        for (let key of required) {
            if (!Object.keys(this.state.formControls).includes(key) || this.state.formControls[key] == undefined || this.state.formControls[key] == "") {
                this.toastNotify("Please, complete the form", "error");
                return;
            }
        }

        if (password != confirmP) {
            this.toastNotify("Passwords must be the same", "error");
            return;
        }

        if (password.length < 8) {
            this.toastNotify("Password must be 8 characters long", "error");
            return;
        }

        this.fetch_register(email, password);
    }

    loginHandler = event => {
        if (this.state.formControls.email != undefined && this.state.formControls.password != undefined) {
            this.fetch_login(this.state.formControls.email, this.state.formControls.password);
        }
    }


    logoutHandler = event => {
        this.setState({
            ...this.state,
            loggedIn: false,
            formControls: {
                "email": "",
                "password": "",
                "firstname": "",
                "lastname": "",
                "firstname_shipping": "",
                "lastname_shipping": "",
                "country": "",
                "zip_code": "",
                "city": "",
                "mobile_number": "",
                "address_line_1": "",
                "address_line_2": ""
            }
        });
        this.toastNotify("logged out", "success");

    }

    conv_lower(str_) {
        return str_.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "").replace(/ /g, "_");
    }

    formField(type, name, section) {
        const name_lower = (section != "") ? this.conv_lower(name) + "_" + section : this.conv_lower(name);
        const value = this.state.formControls[name_lower] == undefined ? '' : this.state.formControls[name_lower].value;
        return (
            <form> <label> {name}  <input type={type} name={name_lower} value={value} id={name_lower} onChange={this.changeHandler} />  </label> </form>
        );
    }

    render() {
        alert(JSON.stringify(this.state, null, 4));

        const countries = require('../resources/countries.json');
        return (
            <div className="checkout">
                <div className="personal_details">
                    <div id="wrapper">
                        <h2> Personal details </h2>
                        {this.state.loggedIn && <input type="email" placeholder="Email" name="email" value={this.state.formControls.email} onChange={this.changeHandler} disabled required />}
                        {!this.state.loggedIn && <input type="email" placeholder="Email" name="email" value={this.state.formControls.email} onChange={this.changeHandler} required />}


                        {this.state.loggedIn && <label> Already Registered? <input type="checkbox" name="already_registered" onChange={this.checkBoxAlreadyHandler} disabled /> </label>}
                        {!this.state.loggedIn && <label> Already Registered? <input type="checkbox" name="already_registered" onChange={this.checkBoxAlreadyHandler} /> </label>}

                        {this.state.loggedIn && (this.state.already_registered) && <input type="password" placeholder="Password " name="password" value={this.state.formControls.password} onChange={this.changeHandler} disabled required />}
                        {!this.state.loggedIn && (this.state.already_registered) && <input type="password" placeholder="Password " name="password" value={this.state.formControls.password} onChange={this.changeHandler} required />}

                        {(this.state.already_registered) && !this.state.loggedIn && <input type="button" value="Login" name="login" id="login_btn" onClick={this.loginHandler} />}
                        {(this.state.already_registered) && this.state.loggedIn && <input type="button" value="Logout" name="logout" id="logout_btn" onClick={this.logoutHandler} />}

                        <form> <input placeholder=" First name " type="text" name="firstname" value={this.state.formControls.firstname} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder=" Last name " type="text" name="lastname" value={this.state.formControls.lastname} onChange={this.changeHandler} />  </form>
                    </div>
                </div>


                <div className="delivery_details">
                    <div id="wrapper">

                        <h2> Delivery address </h2>
                        <form>
                            <input placeholder="First name " type="text" name="firstname_shipping" value={this.state.formControls.firstname_shipping} onChange={this.changeHandler} />
                        </form>
                        <form> <input placeholder="Last name " type="text" name="lastname_shipping" value={this.state.formControls.lastname_shipping} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="Address line 1 " type="text" name="address_line_1" value={this.state.formControls.address_line_1} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="Address line 2 " type="text" name="address_line_2" value={this.state.formControls.address_line_2} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="Country " type="text" name="country" value={this.state.formControls.country} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="Zip code " type="text" name="zip_code" value={this.state.formControls.zip_code} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="City " type="text" name="city" value={this.state.formControls.city} onChange={this.changeHandler} />  </form>
                        <form> <input placeholder="Mobile number " type="text" name="mobile_number" value={this.state.formControls.mobile_number} onChange={this.changeHandler} />  </form>

                        {(this.state.already_registered_personal) && this.formField("button", "update information", "")}
                        {!this.state.already_registered && <label> Create an account?
                        <input type="checkbox" name="create_an_account" onChange={this.checkBoxCreateHandler} /></label>}

                        {this.state.create_an_account && !this.state.already_registered && <input type="password" placeholder="Password " name="register_password" onChange={this.changeHandler} />}
                        {this.state.create_an_account && !this.state.already_registered && <input type="password" placeholder="Confirm password " name="confirm_password" onChange={this.changeHandler} />}
                        {(this.state.create_an_account) && !this.state.already_registered && <form><input type="button" value="Register" name="register" id="register_btn" onClick={this.registerHandler} /></form>}


                        {this.state.already_registered && <form> <input value=" Update Shipping Information " type="button" name="update_shipping"
                            onChange={this.changeHandler} onClick={this.updateHandler} />  </form>}

                    </div>
                </div>


                <div className="payment_method">
                    <div id="wrapper">
                        <h2> Payment method </h2>
                        <ul>
                            <li>
                                <input type="radio" id="card" name="payment_method" value="card" onChange={this.changeHandler} /> <label for="card"> Credit/debit card </label>
                            </li>
                            <li>
                                <input type="radio" id="paypal" name="payment_method" value="paypal" onChange={this.changeHandler} /> <label for="paypal">PayPal</label>
                            </li>
                            <li><input type="radio" id="transfer" name="payment_method" value="bank_transfer" onChange={this.changeHandler} /> <label for="transfer">Bank Transfer</label>
                            </li>
                            <li><input type="radio" id="bitcoin" name="payment_method" value="bitcoin" onChange={this.changeHandler} /> <label for="bitcoin">Bitcoin</label>
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.formControls.payment_method == "card") && <CreditCard name={this.state.formControls.firstname + " " + this.state.formControls.lastname} />}
                {(this.state.formControls.payment_method == "bitcoin") && <Bitcoin />}

                <div className="order_summary">

                    {<Order orderItems={this.state.productsCart} callbackFromParent={this.props.callbackOrder} type="checkout" />}

                    <div className="discount_code">
                        <input placeholder="Discount code" type="text" id="cupon_form" onChange={this.changeHandler} />
                        <input type="button" value="Add" name="cupon" id="cupon_button" onClick={this.changeHandler} />
                    </div>
                    <div className="add_comments">
                        <textarea cols="40" rows="3" placeholder="Add any other comments" name="add_comments" id="comments" onChange={this.changeHandler}></textarea>
                    </div>
                    <div className="purchase_button">
                        <form> <input type="button" value="Purchase" name="purchase_btn" id="purchase_btn" onClick={this.changeHandler} /></form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Checkout;
