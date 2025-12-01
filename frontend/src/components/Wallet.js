import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SingleCard from './SingleCard';

function Wallet() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardFullName, setCardFullName] = useState('');
    const [cardNickname, setCardNickname] = useState('');
    const [cardSecurity, setCardSecurity] = useState('');
    const [cardExpDate, setCardExpDate] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [token, setToken] = useState(''); // Set this with your authentication token if needed

    useEffect(() => {
        // Fetch cards data
        fetch('http://127.0.0.1:8000/api/cards/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setCards(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });

        // Fetch customer ID from local storage
        const storedCustomerId = localStorage.getItem('customer_id');
        if (storedCustomerId) {
            setCustomerId(parseInt(storedCustomerId, 10));
        }
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!cardNumber || !cardFullName || !cardNickname || !cardSecurity || !cardExpDate) {
            alert('Please fill all fields and ensure valid inputs.');
            return;
        }

        const cardData = {
            card_no: parseInt(cardNumber, 10),
            full_name: cardFullName,
            card_nickname: cardNickname,
            security: parseInt(cardSecurity, 10),
            exp_date: cardExpDate,
            customer: customerId
        };

        console.log('Request Payload:', cardData);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/cards/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cardData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Card added successfully:', responseData);
            setCards(prevCards => [...prevCards, responseData]); // Update state with new card
            setShowForm(false); // Hide form after submission
        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    const handleRemoveCard = async (cardId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cards/${cardId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Card removed successfully');
            // Remove card from state immediately
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
        } catch (error) {
            console.error('Error removing card:', error);
        }
    };

    const filteredCards = cards.filter(card => card.customer === customerId);

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
                            <Link to="/Orders" className="nav-link link-dark">
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
                            <Link to="/Wallet" className="nav-link active">
                                <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                                Wallet
                            </Link>
                        </li>
                    </ul>
                    <hr />
                </div>
            </div>
            {filteredCards.length > 0 ? (
                filteredCards.map(card => (
                    <SingleCard key={card.id} card={card} onRemove={handleRemoveCard} />
                ))
            ) : (
                <div>No cards available</div>
            )}
            <div className="text-center">
                <button className="btn btn-success mt-4" onClick={() => setShowForm(true)}>Add Card</button>
            </div>
            {showForm && (
                <div className="card mt-4 p-4">
                    <h5>Add New Card</h5>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">Card Number</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cardFullName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cardFullName"
                                value={cardFullName}
                                onChange={(e) => setCardFullName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cardNickname" className="form-label">Card Nickname</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cardNickname"
                                value={cardNickname}
                                onChange={(e) => setCardNickname(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cardSecurity" className="form-label">Security Code</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cardSecurity"
                                value={cardSecurity}
                                onChange={(e) => setCardSecurity(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cardExpDate" className="form-label">Expiration Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="cardExpDate"
                                value={cardExpDate}
                                onChange={(e) => setCardExpDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Card</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Wallet;
