import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SingleAddress from './SingleAddress';


function AddressBook() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street_address: '',
        secondary_address: '',
        zipcode: '',
        state: '',
        country: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Fetch customer ID from local storage
        const storedCustomerId = localStorage.getItem('customer_id');
        if (storedCustomerId) {
            setCustomerId(parseInt(storedCustomerId, 10));
        }

        // Fetch addresses data
        fetch('http://127.0.0.1:8000/api/addresses/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setAddresses(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    // Filter addresses based on customerId
    const filteredAddresses = addresses.filter(address => {
        if (address.isCustomer) {
            return address.isCustomer === customerId;
        }
        return false;
    });

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/addresses/${addressId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token if required
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove address from local state
            setAddresses(addresses.filter(address => address.id !== addressId));
            console.log('Address deleted successfully');
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        const addressData = {
            ...newAddress,
            isCustomer: customerId
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token if required
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newAddressData = await response.json();
            setAddresses([...addresses, newAddressData]);
            setShowForm(false); // Hide the form after successful addition
            setNewAddress({
                street_address: '',
                secondary_address: '',
                zipcode: '',
                state: '',
                country: ''
            });
            console.log('Address added successfully');
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

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
                            <Link to="/AddressBook" className="nav-link active">
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
            {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
                    <SingleAddress key={address.id} address={address} onDelete={handleDeleteAddress} />
                ))
            ) : (
                <div>No addresses available</div>
            )}
            <div className="text-center">
                <button className="btn btn-success mt-4" onClick={() => setShowForm(true)}>Add Address</button>
            </div>
            {showForm && (
                <form onSubmit={handleAddAddress} className="mt-4">
                    <div className="mb-3">
                        <label htmlFor="street_address" className="form-label">Street Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="street_address"
                            name="street_address"
                            value={newAddress.street_address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="secondary_address" className="form-label">Secondary Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="secondary_address"
                            name="secondary_address"
                            value={newAddress.secondary_address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="zipcode" className="form-label">Zipcode</label>
                        <input
                            type="text"
                            className="form-control"
                            id="zipcode"
                            name="zipcode"
                            value={newAddress.zipcode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            id="state"
                            name="state"
                            value={newAddress.state}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                            type="text"
                            className="form-control"
                            id="country"
                            name="country"
                            value={newAddress.country}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
}

export default AddressBook;



