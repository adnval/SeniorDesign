import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SingleProduct from './SingleProduct';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = useQuery().get('query') || '';

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/products/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const filteredProducts = data.filter(product =>
                    product.product_name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase())
                );
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
    }, [query]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h2>Search Results for "{query}"</h2>
            <div className="row">
                {products.length > 0 ? (
                    products.map(product => (
                        <SingleProduct key={product.id} product={product} />
                    ))
                ) : (
                    <div>No products found</div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
