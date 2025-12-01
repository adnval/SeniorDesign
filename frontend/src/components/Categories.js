import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import SingleCategory from './SingleCategory';
import { useState, useEffect } from 'react';



function Categories() {
    const [Categories, setCategories] = useState([]);
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
                setCategories(data); // Set products directly as data is the array
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData('http://127.0.0.1:8000/api/categories/');
    }, []);
    return (
        <div className="container-lg">
                        <h1 className="mt-5 mb-5 positiion-absolute start-50">All Categories</h1>

                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {Array.isArray(Categories) && Categories.length > 0 ? (
                        Categories.map((category) => (
                            <SingleCategory key={category.id} category={category} />
                        ))
                    ) : (
                        <div>No categories available</div>
                    )}

                    
                   
                </div>
                {/*pagination */}
                <nav aria-label="Page navigation example">
                    <ul class="pagination mt-4 align-self-center">
                        <li class="page-item">
                            <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                            </a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                            <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
                 
    )
}
export default Categories;