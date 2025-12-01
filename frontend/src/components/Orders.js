import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SingleOrder from './SingleOrder';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        const storedCustomerId = localStorage.getItem('customer_id');
        if (storedCustomerId) {
            setCustomerId(parseInt(storedCustomerId, 10));
        }
        fetchData('http://127.0.0.1:8000/api/orders/');
    }, []);

    const fetchData = async (baseurl) => {
        try {
            const response = await fetch(baseurl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => order.user === customerId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <div className="container-md">
                <div className="col md-4 col-12 mb-2 mt-4">
                    <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                        <span className="fs-4">Dashboard</span>
                    </div>
                    <hr />
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item">
                            <Link to="/Dashboard" className="nav-link link-dark" aria-current="page">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home" /></svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/Orders" className="nav-link active">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#speedometer2" /></svg>
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link to="/Profile" className="nav-link link-dark">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table" /></svg>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/AddressBook" className="nav-link link-dark">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#grid" /></svg>
                                Addresses
                            </Link>
                        </li>
                        <li>
                            <Link to="/Wallet" className="nav-link link-dark">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                                Wallet
                            </Link>
                        </li>
                    </ul>
                    <hr />
                </div>
            </div>

            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <SingleOrder key={order.id} orderId={order.id} />
                ))
            ) : (
                <div>No orders available</div>
            )}
        </div>
    );
}

export default Orders;


