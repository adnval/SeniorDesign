import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SingleProduct(props) {
    const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
    const productData = props.product;
    const quantity = 1; // Default quantity, you can modify this as needed

    const cartAddButtonHandler = () => {
        let previousCart = localStorage.getItem('cartData');
        let cartJson = previousCart ? JSON.parse(previousCart) : [];

        const cartItemIndex = cartJson.findIndex(cart => cart.product.id === productData.id);
        if (cartItemIndex !== -1) {
            cartJson[cartItemIndex].quantity += quantity;
        } else {
            const cartItem = {
                'product': {
                    'id': productData.id,
                    'title': productData.product_name, // Adjust the property name if needed
                },
                'user': {
                    'id': 1 // Assuming a default user ID, adjust as necessary
                },
                'quantity': quantity
            };
            cartJson.push(cartItem);
        }

        localStorage.setItem('cartData', JSON.stringify(cartJson));
        setCartButtonClickStatus(true);
    };

    const cartRemoveButtonHandler = () => {
        let previousCart = localStorage.getItem('cartData');
        if (previousCart) {
            let cartJson = JSON.parse(previousCart);
            cartJson = cartJson.filter(cart => cart && cart.product.id !== productData.id);
            localStorage.setItem('cartData', JSON.stringify(cartJson));
        }
        setCartButtonClickStatus(false);
    };

    return (
        <div className="col">
            <div className="card h-100">
                <Link to={`/product/${productData.id}`}>
                    <img src={productData.image} className="card-img-top" alt={productData.product_name} />
                </Link>
                <div className="card-body">
                    <Link to={`/product/${productData.id}`}>
                        <h5 className="card-title">{productData.product_name}</h5>
                    </Link>
                    <h5 className="card-title text-muted">
                        <small>${productData.price}</small>
                    </h5>
                    <p className="card-text">{productData.description}</p>
                </div>
                <div className="card-footer">
                    {!cartButtonClickStatus ? (
                        <button
                            type="button"
                            onClick={cartAddButtonHandler}
                            className="shadow btn custom-btn"
                        >
                            Add to cart
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={cartRemoveButtonHandler}
                            className="shadow btn custom-btn btn-danger"
                        >
                            <small>Remove</small>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;
