import React, { Component } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Checkout.css';

class CreditCard extends Component {

    constructor(props) {

        super(props);
        this.state = {
            name: ""
        }
    }

    componentDidMount() {
        if(this.props.name!=undefined)
        this.setState({name: this.props.name});
    }

    render() {

        return (
            <div className="credit_card_details">
                <div id="wrapper">
                    <h2>Credit card details</h2>
                    <form>
                        <div>
                            <input type="text" id="name_card" name="name" placeholder="Your name" value={this.state.name } />
                        </div>
                        <div>
                            <input type="text" id="number_card" name="number" placeholder="Card number" />
                        </div>
                        <div>
                            <input type="text" id="date_card" name="expiry" placeholder="MM/YY" />
                            <input type="text" id="cvc_card" name="cvc" placeholder="CVC" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreditCard;

