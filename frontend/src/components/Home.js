import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


function Home() {
    const isLoggedIn = localStorage.getItem('customer_login');

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirect to the login page if the user is not logged in
            window.location.href = '/LogIn';
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        // If the user is not logged in, we return null to avoid rendering the rest of the component
        window.location.href = '/LogIn';

    }

    return (
        <div className="container-md">
            <div className="col md-4 col-12 mb-2 mt-4">
                <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                    <span className="fs-4">Dashboard</span>
                </div>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/Dashboard" className="nav-link active" aria-current="page">
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
                        <Link to="/Wallet" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                            Wallet
                        </Link>
                    </li>
                </ul>
                <hr />
            </div>
        </div>
    )
}

export default Home;

