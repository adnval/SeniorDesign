import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SingleProduct from './SingleProduct';
import 'bootstrap/dist/css/bootstrap.css';


function CategoryProducts() {
    const [Products, setProducts] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState(''); // State for category name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { category } = useParams();
    const categoryId = parseInt(category, 10); // Convert category to an integer

    function fetchData() {
        // Fetch products
        fetch('http://127.0.0.1:8000/api/products/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched products data:', data); // Log fetched data
                setProducts(data);
            })
            .catch((error) => {
                console.error('Fetch products error:', error);
                setError(error);
            });

        // Fetch categories
        fetch('http://127.0.0.1:8000/api/categories/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched categories data:', data); // Log fetched data
                setCategories(data);
                const selectedCategory = data.find(cat => cat.id === categoryId);
                if (selectedCategory) {
                    setCategoryName(selectedCategory.name);
                }
            })
            .catch((error) => {
                console.error('Fetch categories error:', error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Filter products based on category ID
    const filteredProducts = Products.filter(product =>
        product.category === categoryId
    );

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <div className="container-lg m-10">
            <h1 className="align-self-center mt-6">{categoryName} Product List</h1>
            <div className="container-lg">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error.message}</div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <SingleProduct key={product.id} product={product} />
                        ))
                    ) : (
                        <div>No products available</div>
                    )}
                </div>
                {/* Pagination */}
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
            </div>
        </>
    );
}

export default CategoryProducts;
