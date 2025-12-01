// SingleAddress.js

import React from 'react';

function SingleAddress({ address, onDelete }) {
    const handleDelete = () => {
        onDelete(address.id); // Call the onDelete function with the address id
    };

    return (
        <div className="card mb-3 border rounded">
            <div className="card-body">
                <p className="card-text">
                    <h5 className="primary-address card-title">{address.street_address}</h5>
                    <p className="secondary-address">
                        {address.secondary_address && (
                            <div>{address.secondary_address}</div>
                        )}
                    </p>
                    <p className="zip-code">{address.zipcode}</p>
                    <p className="location">{address.state}, {address.country}</p>
                </p>
                <button className="btn btn-primary mr-2">Make Default</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default SingleAddress;
