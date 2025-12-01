import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PaymentCard from './PaymentCard';
import AddressSection from './AddressSection';

function Checkout() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [orderTotal, setOrderTotal] = useState(0);
    const [cards, setCards] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
    const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState('standard'); // Default to standard delivery
    const [customerId, setCustomerId] = useState(null);
    const [token, setToken] = useState(''); // Set this with your authentication token if needed
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [error, setError] = useState(null); // Initialize error state
    const [balance, setBalance] = useState(null);
    const [customerId2, setCustomerId2] = useState([]);
    const [customer, setCustomer] = useState([]);

    useEffect(() => {
        const storedCustomerId = localStorage.getItem('customer_id');
        if (storedCustomerId) {
            setCustomerId(parseInt(storedCustomerId, 10));
            setCustomerId2(parseInt(storedCustomerId, 10));
        }


        // Fetch addresses and cards data
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
            calculateOrderTotal(cartItems);
            console.log(cartItems);

            const addressResponse = await fetch('http://127.0.0.1:8000/api/addresses/');
            if (!addressResponse.ok) throw new Error('Network response was not ok');
            const addressData = await addressResponse.json();
            setAddresses(addressData);

            const cardResponse = await fetch('http://127.0.0.1:8000/api/cards/');
            if (!cardResponse.ok) throw new Error('Network response was not ok');
            const cardData = await cardResponse.json();
            setCards(cardData);

            const customerResponse = await fetch('http://127.0.0.1:8000/api/customers/');
            if (!customerResponse.ok) throw new Error('Network response was not ok');
            const customerData = await customerResponse.json();
            setCustomer(customerData);

        } catch (error) {
            console.error('Fetch error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOrderTotal = (cartItems) => {
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);
        setOrderTotal(total);
    };

    const handleSelectAddress = (address, type) => {
        if (type === 'shipping') {
            setSelectedShippingAddress(address);
        } else if (type === 'billing') {
            setSelectedBillingAddress(address);
        }
    };

    const handleSelectCard = (card) => {
        setSelectedCard(card);
    };

    const handleDeliveryMethodChange = (event) => {
        setDeliveryMethod(event.target.value);
    };

    const handlePlaceOrder = async () => {
        if (!selectedCard || !selectedShippingAddress || !selectedBillingAddress) {
            alert('Please select a card, shipping address, and billing address.');
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem('cartData')) || [];

        const orderData = {
            user: customerId,
            status: 'Pending',
            card: selectedCard.id,
            shipping_address: selectedShippingAddress.id,
            billing_address: selectedBillingAddress.id,
            delivery_method: deliveryMethod,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            console.log('Order created successfully:', responseData);

            const orderId = responseData.id;
            const orderItemsData = cartItems.map(item => ({
                order: orderId,
                product: item.product.id,
                quantity: item.quantity
            }));

            await Promise.all(orderItemsData.map(async (orderItem) => {
                const response = await fetch('http://127.0.0.1:8000/api/order-items/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(orderItem)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            }));


            const today = new Date();
            let shipDate = today.toISOString().split('T')[0];
            let deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + (deliveryMethod === 'express' ? 4 : 7));
            deliveryDate = deliveryDate.toISOString().split('T')[0];
            const formattedPrice = parseFloat(getTotalWithDelivery().toFixed(2));

            const deliveryPlanData = {
                order: orderId,
                delivery_type: deliveryMethod,
                price: formattedPrice,
                ship_date: shipDate,
                delivery_date: deliveryDate,
            };

            await fetch('http://127.0.0.1:8000/api/delivery-plans/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(deliveryPlanData)
            });

            const getCustomerBalance = (customers, customerId2) => {
                // Find the customer with the matching ID
                const customer = customers.find(customer => customer.id === customerId2);

                // Return the balance of the customer if found, otherwise return 0
                return customer ? parseFloat(customer.balance) : 0; // Ensure balance is a number
            };

            const customerBalance = getCustomerBalance(customer, customerId2);
            const deliveryCost = getTotalWithDelivery();

            // Ensure both values are treated as numbers before addition
            const newBalance = parseFloat(customerBalance) + parseFloat(deliveryCost);

            console.log(`New balance: $${newBalance.toFixed(2)}`); // Output the new balance formatted to two decimal places

                try {
                    

                    const response = await fetch(`http://127.0.0.1:8000/api/customers/${customerId2}/`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ balance: newBalance })
                    });

                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                    setBalance(newBalance); // Update balance state after successful response
                    console.log('Customer balance updated successfully');
                } catch (error) {
                    console.error('Error updating customer balance:', error);
                }


            localStorage.removeItem('cartData');

            // Redirect to OrderPlaced.js
            navigate('/OrderPlaced');

        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const filteredAddresses = addresses.filter(address => address.isCustomer === customerId);
    const filteredCards = cards.filter(card => card.customer === customerId);

    const getDeliveryCost = () => {
        return deliveryMethod === 'express' ? 5.99 : 2.99;
    };

    const getTotalWithDelivery = () => {
        return orderTotal + getDeliveryCost();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <div className="order-total">
                <h3>Order Total: ${orderTotal.toFixed(2)}</h3>
            </div>

            <AddressSection
                title="Shipping Address"
                addresses={filteredAddresses}
                selectedAddress={selectedShippingAddress}
                onSelectAddress={(address) => handleSelectAddress(address, 'shipping')}
            />

            <AddressSection
                title="Billing Address"
                addresses={filteredAddresses}
                selectedAddress={selectedBillingAddress}
                onSelectAddress={(address) => handleSelectAddress(address, 'billing')}
            />

            <div className="card-selection">
                <h4>Select Payment Method</h4>
                {filteredCards.length > 0 ? (
                    filteredCards.map(card => (
                        <PaymentCard
                            key={card.id}
                            card={card}
                            onSelect={handleSelectCard}
                            isSelected={selectedCard && selectedCard.id === card.id}
                        />
                    ))
                ) : (
                    <div>No cards available</div>
                )}
            </div>

            <div className="mt-4">
                <h4>Delivery Method</h4>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        id="standardDelivery"
                        name="deliveryMethod"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={handleDeliveryMethodChange}
                    />
                    <label className="form-check-label" htmlFor="standardDelivery">
                        Standard Delivery (5-7 business days) - $2.99
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        id="expressDelivery"
                        name="deliveryMethod"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={handleDeliveryMethodChange}
                    />
                    <label className="form-check-label" htmlFor="expressDelivery">
                        Express Delivery (3-4 business days) - $5.99
                    </label>
                </div>
            </div>

            <div className="text-center mt-4">
                <h4>Total with Delivery: ${getTotalWithDelivery().toFixed(2)}</h4>
                <button
                    className="btn btn-success"
                    onClick={handlePlaceOrder}
                    disabled={!selectedCard || !selectedShippingAddress || !selectedBillingAddress}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

export default Checkout;

