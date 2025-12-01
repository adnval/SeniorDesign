import React, { useState } from 'react';

function AddressSection({ title, addresses, selectedAddress, onSelectAddress }) {
    const [showList, setShowList] = useState(false); // Track whether to show the list

    const handleAddressClick = (address) => {
        onSelectAddress(address);
        setShowList(false); // Hide the list after selection
    };

    return (
        <div className="mb-4">
            <h4>{title}</h4>
            {selectedAddress ? (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">{selectedAddress.street_address}</h5>
                        <p>{selectedAddress.secondary_address}</p>
                        <p>{selectedAddress.state}, {selectedAddress.country} {selectedAddress.zipcode}</p>
                        <button className="btn btn-info" onClick={() => setShowList(!showList)}>
                            {showList ? 'Hide Addresses' : 'Choose Address'}
                        </button>
                        {showList && (
                            <div className="mt-3">
                                {addresses.map(address => (
                                    <div key={address.id} className="card mb-2">
                                        <div className="card-body">
                                            <h6 className="card-title">{address.street_address}</h6>
                                            <p>{address.secondary_address}</p>
                                            <p>{address.state}, {address.country} {address.zipcode}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAddressClick(address)}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card mt-3">
                    <div className="card-body">
                        <p>No {title.toLowerCase()} selected</p>
                        <button className="btn btn-info" onClick={() => setShowList(true)}>Choose Address</button>
                        {showList && (
                            <div className="mt-3">
                                {addresses.map(address => (
                                    <div key={address.id} className="card mb-2">
                                        <div className="card-body">
                                            <h6 className="card-title">{address.street_address}</h6>
                                            <p>{address.secondary_address}</p>
                                            <p>{address.state}, {address.country} {address.zipcode}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAddressClick(address)}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddressSection;

