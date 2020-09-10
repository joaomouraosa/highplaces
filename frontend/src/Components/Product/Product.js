import React, { Component } from "react";
import './Product.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {API_PATH, STATIC_PATH} from '../../config/defaults'

class Product extends Component {

    constructor(props) {
        super(props);
        this.state = { product: this.props.item, quantity: 1 };
        this.handleChange = this.handleChange.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        toast.configure();
    }

    componentDidUpdate() {
        if (this.props.item != this.state.product)
            this.setState({ product: this.props.item })
    }

    handleChange(event) {
        this.setState({ quantity: event.target.value });
    }

    handleAddToCart() {
        let obj = {
            ...this.props.item,
            quantity: this.state.quantity
            //            item: this.props.item,
            // quantity: this.state.quantity
        }
        toast.success("Product added to cart", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        this.props.callbackFromParent(obj);
    }

    render() {
        return (
            <div className="product_page">
                <div className="product_picture">
                    <img src={STATIC_PATH + "/images/products/" + this.state.product.id + ".png"} />

                </div>
                <div className="product_name">
                    <h2 id="title">{this.state.product.name}</h2>
                    <span id="description">TODO some text here Organic 8:1 Dual-Extract, Fruiting Bodies (Nammex) blablba</span>

                </div>
                <div className="separator_1">
                <hr></hr>
                </div>
                <div className="separator_2">
                <hr></hr>
                </div>
                <div className="product_price">
                    <h2>{this.state.product.price}€</h2>

                </div>

                <div className="product_quantity">
                    <form>
                        <label> Quantity:
                            <input type="number"
                                id="quantity"
                                min="1"
                                value={this.state.quantity}
                                onChange={this.handleChange}
                            />
                        </label>

                    </form>
                </div>
                <div className="product_add_to_cart">

                    <input type="button"
                        value="Add to cart"
                        onClick={this.handleAddToCart}
                    />
                </div>
                <div className="product_availability">
                    {(this.state.product.stock) > 0 && <h2> Available</h2>}
                    {(this.state.product.stock) == 0 && <h2> Not Available</h2>}
                </div>
                <div className="product_information">

                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
                </div>
                <div className="customers_also_bought">
                </div>



            </div>
        );
    }
}

export default Product;


