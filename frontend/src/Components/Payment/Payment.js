import React from "react";
import StripeCheckout from 'react-stripe-checkout'

export default function Payment() {
    const stripe_key = "pk_test_51HHBU4HeVJzIOzKuzYzPHHdtZJnBL8qnN9MFprzU2MBFtZzPvYF66lNUyPlvD35fQKjhXXbCdo2iefqi7ZReaFeO00qfiDw1PY";

    function handleToken(token, addresses) {
        console.log({ token, addresses });
    }

    return (
        <div className="payment">
            <StripeCheckout
                stripeKey={stripe_key}
                token={handleToken}
            >
            </StripeCheckout>
        </div>
    );
    /*
        return (
            <div className="payment">
                <StripeCheckout
                    stripeKey={stripe_key}
                    token={handleToken}>
                    billingAddress={}
                    shippingAddress={}
                    order_id={}
                    hash={}
                </StripeCheckout>
            </div>
        );
        */
}
