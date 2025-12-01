import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SingleCartItem from './SingleCartItem';

function Cart() {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartData = async () => {
            const cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
            const productIds = cartItems.map(item => item.product.id);
            const uniqueProductIds = [...new Set(productIds)];

            try {
                const responses = await Promise.all(
                    uniqueProductIds.map(id => fetch(`http://127.0.0.1:8000/api/products/${id}/`))
                );

                const products = await Promise.all(
                    responses.map(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                );

                const updatedCartItems = cartItems.map(cartItem => {
                    const product = products.find(p => p.id === cartItem.product.id);
                    return { ...cartItem, product };
                });

                // Calculate the total price for each set of items
                const cartWithTotal = updatedCartItems.map(item => {
                    const totalPrice = item.product.price * item.quantity;
                    return { ...item, totalPrice };
                });

                setCartData(cartWithTotal);
                localStorage.setItem('cartData', JSON.stringify(cartWithTotal)); // Save updated cart data with total price
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const updateQuantity = (productId, newQuantity) => {
        const updatedCartData = cartData.map(item => {
            if (item.product.id === productId) {
                const updatedItem = { ...item, quantity: newQuantity };
                updatedItem.totalPrice = updatedItem.product.price * newQuantity; // Update total price
                return updatedItem;
            }
            return item;
        });
        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData)); // Save updated cart data with total price
    };

    const removeItem = (productId) => {
        const updatedCartData = cartData.filter(item => item.product.id !== productId);
        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData)); // Save updated cart data with total price
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (cartData.length === 0) {
        return <h1>Your cart is empty</h1>;
    }

    return (
        <div className="container my-5">
            <h2>Shopping Cart</h2>
            <div className="row">
                {cartData.map((item, index) => (
                    <SingleCartItem
                        key={index}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                    />
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </div>
        </div>
    );
}

export default Cart;
