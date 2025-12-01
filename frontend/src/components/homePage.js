import 'bootstrap/dist/css/bootstrap.css';
import pineapples from '../images/pineapples.jpeg';
import '../App.css';
import { useState, useEffect } from 'react';
import SingleProduct from './SingleProduct';

function HomePage() {
    const [Products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function fetchData(baseurl) {
        fetch(baseurl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched data:', data); // Log fetched data to verify
                setProducts(data); // Set products directly as data is the array
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData('http://127.0.0.1:8000/api/products/');

        const handleScroll = () => {
            const sidebar = document.querySelector('.sticky-sidebar');
            const footer = document.querySelector('footer');
            const footerRect = footer.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            const offset = 20; // Adjust this value as per your requirement

            if (footerRect.top - sidebarRect.height - offset <= 0) {
                sidebar.style.top = `${footerRect.top - sidebarRect.height - offset}px`;
            } else {
                sidebar.style.top = '80px'; // Same value as the CSS top value
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <div className="p-5 text-center bg-image" style={{ backgroundImage: `url(${pineapples})`, height: '350px' }}>
                <div className="mask">
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-white">
                            <h1 className="mb-3">Grocery Store</h1>
                            <h4 className="mb-3">all your food needs, below</h4>
                            <a data-mdb-ripple-init className="btn btn-outline-light btn-lg" href="/categories" role="button">Shop Categories</a>
                        </div>
                    </div>
                </div>
            </div>
            <main className="container-lg mt-5">
                <div className="row">
                    <div className="col-md-3">
                        {/* bootstrap sidebar */}
                        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light sticky-sidebar">
                            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                                <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                                <span className="fs-4">Popular Categories</span>
                            </a>
                            <hr />
                            <ul className="nav nav-pills flex-column mb-auto">
                                <li className="nav-item">
                                    <a href="/category/1" className="nav-link link-dark" aria-current="page">
                                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#category/1" /></svg>
                                        Fruit
                                    </a>
                                </li>
                                <li>
                                    <a href="category/10" className="nav-link link-dark">
                                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#speedometer2" /></svg>
                                        Snacks
                                    </a>
                                </li>
                                <li>
                                    <a href="category/4" className="nav-link link-dark">
                                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table" /></svg>
                                        Meat
                                    </a>
                                </li>
                                <li>
                                    <a href="category/8" className="nav-link link-dark">
                                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#grid" /></svg>
                                        Grains
                                    </a>
                                </li>
                                <li>
                                    <a href="category/6" className="nav-link link-dark">
                                        <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                                        Beverages
                                    </a>
                                </li>
                            </ul>
                            <hr />
                        </div>
                    </div>
                    {/* bootstrap card gallery */}
                    <div className="col-md-9">
                        <div className="row row-cols-1 row-cols-md-3 g-3">
                            {Array.isArray(Products) && Products.length > 0 ? (
                                Products.map((product) => (
                                    <SingleProduct key={product.id} product={product} />
                                ))
                            ) : (
                                <div>No products available</div>
                            )}
                        </div>
                    </div>
                    {/*pagination */}
                    <nav aria-label="Page navigation example">
                        <ul className="pagination mt-4 align-self-center">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </main>
        </>
    );
}

export default HomePage;
