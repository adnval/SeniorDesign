import React, { useState } from 'react';

function PaymentCard({ card, onRemove, onSelect, isSelected }) {
    const [showDetails, setShowDetails] = useState(false); // State to track if details are shown

    const handleCardClick = () => {
        onSelect(card);
    };

    const handleShowDetails = (event) => {
        event.stopPropagation(); // Prevent the card click event from firing
        setShowDetails(!showDetails); // Toggle details visibility
    };

    return (
        <div
            className={`card mb-2 ${isSelected ? 'border-primary' : ''}`}
            style={{
                border: isSelected ? '2px solid blue' : '1px solid #ddd',
                cursor: 'pointer'
            }}
            onClick={handleCardClick}
        >
            <div className="card-body">
                <h5 className="card-title">{card.card_nickname || 'Card'}</h5>
                {showDetails && (
                    <div>
                        <p><strong>Card Number:</strong> {card.card_no}</p>
                        <p><strong>Full Name:</strong> {card.full_name}</p>
                        <p><strong>Security Code:</strong> {card.security}</p>
                        <p><strong>Expiration Date:</strong> {card.exp_date}</p>
                    </div>
                )}
                <button
                    className="btn btn-info"
                    onClick={handleShowDetails}
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
        </div>
    );
}

export default PaymentCard;
