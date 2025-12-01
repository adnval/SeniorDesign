import React, { useState } from 'react';

function SingleCard({ card, onRemove }) {
    const [showInfo, setShowInfo] = useState(false);

    const handleRemove = () => {
        onRemove(card.id);
        setShowInfo(false); // Close dropdown after removal
    };

    return (
        <div className="card mt-2 p-3">
            <div className="d-flex justify-content-between align-items-center">
                <h5>{card.card_nickname}</h5>
                <button className="btn btn-info" onClick={() => setShowInfo(!showInfo)}>
                    {showInfo ? 'Hide Info' : 'Show Info'}
                </button>
            </div>
            {showInfo && (
                <div className="mt-3">
                    <p><strong>Card Number:</strong> {card.card_no}</p>
                    <p><strong>Expiration Date:</strong> {card.exp_date}</p>
                    <p><strong>Security Code:</strong> {card.security}</p>
                    <button className="btn btn-danger" onClick={handleRemove}>Remove Card</button>
                </div>
            )}
        </div>
    );
}

export default SingleCard;
