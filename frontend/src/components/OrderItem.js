// JavaScript source code
import React from 'react';

function OrderItem({ item }) {
    return (
        <li className="list-group-item">
            <div>Product: {item.product_name}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: ${item.price.toFixed(2)}</div>
        </li>
    );
}

export default OrderItem;
