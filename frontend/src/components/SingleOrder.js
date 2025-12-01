import React, { useState, useEffect } from 'react';

function SingleOrder({ orderId }) {
    const [order, setOrder] = useState(null);
    const [deliveryPlan, setDeliveryPlan] = useState(null);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Fetch order details
                const orderResponse = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`);
                if (!orderResponse.ok) throw new Error('Network response was not ok');
                const orderData = await orderResponse.json();
                setOrder(orderData);

                // Fetch delivery plan details
                const deliveryResponse = await fetch(`http://127.0.0.1:8000/api/delivery-plans/${orderId}/`);
                if (!deliveryResponse.ok) throw new Error('Network response was not ok');
                const deliveryData = await deliveryResponse.json();
                setDeliveryPlan(deliveryData);

                // Fetch product details for each order item
                const productDetails = await Promise.all(
                    orderData.order_items.map(async (item) => {
                        const productResponse = await fetch(`http://127.0.0.1:8000/api/products/${item.product}/`);
                        if (!productResponse.ok) throw new Error('Network response was not ok');
                        return productResponse.json();
                    })
                );

                const productsMap = {};
                productDetails.forEach((product, index) => {
                    productsMap[orderData.order_items[index].product] = product;
                });
                setProducts(productsMap);

            } catch (error) {
                console.error('Fetch error:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!order || !deliveryPlan) return <div>No order data available</div>;

    // Calculate total price from order items
    const totalPrice = order.order_items.reduce((sum, item) => {
        const product = products[item.product];
        return sum + (product.price * item.quantity);
    }, 0);

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Order {order.id}</h5>
                <ul className="list-group list-group-flush">
                    {order.order_items.map(item => {
                        const product = products[item.product];
                        return (
                            <li key={item.id} className="list-group-item">
                                {item.quantity} x {product.product_name} @ ${product.price}
                            </li>
                        );
                    })}
                </ul>
                <p className="card-text mt-2">Total Price: ${totalPrice.toFixed(2)}</p>
                <p className="card-text">Delivery Type: {deliveryPlan.delivery_type}</p>
                <p className="card-text">Delivery Price: ${(deliveryPlan.price - totalPrice).toFixed(2)}</p>
                <p className="card-text">Shipping Date: {deliveryPlan.ship_date}</p>
                <p className="card-text">Delivery Date: {deliveryPlan.delivery_date}</p>
                <p className="card-text">Status: {order.status}</p>


            </div>
        </div>
    );
}

export default SingleOrder;
