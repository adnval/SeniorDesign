import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext, CartContext } from '../Context';

function Header(props) {
    const userContext = useContext(UserContext);
    const { cartData, setCartDate } = useContext(CartContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search-results?query=${searchQuery}`);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ top: '0' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">DDD Store</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link" to="/Categories" role="button" aria-expanded="true">
                                    Categories
                                </Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                            <input className="form-control me-4" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleSearchChange} />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
                            <li className="nav-item dropdown">
                                <div className="nav-link dropdown-toggle" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="true">
                                    My Profile
                                </div>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li><Link className="dropdown-item" to="/Register">Register</Link></li>
                                    <li><Link className="dropdown-item" to="/LogIn">Log In</Link></li>
                                    <li><Link className="dropdown-item" to="/Dashboard">Dashboard</Link></li>
                                    <li><Link className="dropdown-item" to="customer/LogOut">Log out</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/cart">Cart</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;


