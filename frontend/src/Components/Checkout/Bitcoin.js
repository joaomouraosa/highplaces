import React, { Component } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Checkout.css';

class Bitcoin extends Component {

    constructor(props) {

        super(props);
        this.state = {
        }
    }

    render() {

        return (
            <div class="row mx-0 pt-5 d-flex justify-content-center">
                <div class="col-xs-4 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                    <div class="card shadow-lg">
                        <div class="card-header card-header-divider text-center pt-4">
                            <img src="https://apirone.com/static/promo/bitcoin_logo_vector.svg" class="img-fluid" style="max-height: 42px;" width="205" alt="" /><br></br>
                            <img src="https://apirone.com/api/v1/qr?message=1DonateWffyhwAjskoEwXt83pHZxhLTr8H&format=svg" style="max-width: 190px;" alt="" /> </div>
                        <div class="card-body px-0">
                            <p class="text-center"><small><strong>1DonateWffyhwAjskoEwXt83pHZxhLTr8H</strong></small></p>
                            <p class="text-muted text-center">
                                TODO.... Scan QR code and top-up your<br></br>Bitcoin balance for any amount.<br></br>Payment will be credited after 1 confirmation.<br></br>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bitcoin;

