import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
    const { product } = useParams();
    const productId = parseInt(product, 10); // Convert product ID from URL to an integer

    const [productData, setProductData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [supplierData, setSupplierData] = useState(null); // State for supplier data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
    const [quantity, setQuantity] = useState(1); // Add state for quantity

    useEffect(() => {
        // Fetch product data based on product ID
        fetch(`http://127.0.0.1:8000/api/products/${productId}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched product data:', data); // Log fetched data
                setProductData(data);

                // Fetch supplier data based on supplier ID from product data
                return fetch(`http://127.0.0.1:8000/api/supplier/${data.supplier}/`);
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((supplierData) => {
                console.log('Fetched supplier data:', supplierData); // Log fetched data
                setSupplierData(supplierData);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
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
            })
            .catch((error) => {
                console.error('Fetch categories error:', error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [productId]); // Dependency array includes productId

    // Handle loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!productData) {
        return <div>Product not found</div>;
    }

    const specificCategory = categories.find(category =>
        category.id === productData.category
    );

    const cartAddButtonHandler = () => {
        let previousCart = localStorage.getItem('cartData');
        let cartJson = previousCart ? JSON.parse(previousCart) : [];

        const cartItemIndex = cartJson.findIndex(cart => cart.product.id === productData.id);
        if (cartItemIndex !== -1) {
            cartJson[cartItemIndex].quantity += quantity;
        } else {
            const cartItem = {
                'product': {
                    'id': productData.id,
                    'title': productData.title,
                },
                'user': {
                    'id': 1
                },
                'quantity': quantity
            };
            cartJson.push(cartItem);
        }

        localStorage.setItem('cartData', JSON.stringify(cartJson));
        setCartButtonClickStatus(true);
    };

    const cartRemoveButtonHandler = () => {
        let previousCart = localStorage.getItem('cartData');
        if (previousCart) {
            let cartJson = JSON.parse(previousCart);
            cartJson = cartJson.filter(cart => cart && cart.product.id !== productData.id);
            localStorage.setItem('cartData', JSON.stringify(cartJson));
        }
        setCartButtonClickStatus(false);
    };

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value, 10));
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-5">
                    <div className="main-img">
                        <img className="img-fluid" src={productData.image} alt={productData.product_name} />
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="main-description px-2">
                        <div className="category text-bold">
                            Category: {specificCategory ? specificCategory.name : 'Unknown Category'}<br />
                        </div>
                        <div className="category text-normal my-2">
                            Type: {productData.product_type}
                        </div>
                        <div className="product-title text-bold my-3">
                            {productData.product_name}
                        </div>
                        <div className="product-brand text-normal my-2">
                            Brand: {productData.brand}
                        </div>
                        <div className="price-area my-4">
                            <p className="new-price text-bold mb-1">${productData.price}</p>
                        </div>
                        <div className="buttons d-flex my-5">
                            <div className="block">
                                {!cartButtonClickStatus &&
                                    <button type="button" onClick={cartAddButtonHandler} className="shadow btn custom-btn">Add to cart</button>
                                }
                                {cartButtonClickStatus &&
                                    <button type="button" onClick={cartRemoveButtonHandler} className="shadow btn custom-btn btn-danger"><small>Remove From Cart</small></button>
                                }
                            </div>
                            <div className="block quantity">
                                <input type="number" className="form-control" id="cart_quantity" value={quantity} min="1" max="99" name="cart_quantity" onChange={handleQuantityChange} />
                            </div>
                        </div>
                    </div>
                    <div className="product-details my-4">
                        <p className="details-title text-color mb-1">Product Details</p>
                        {supplierData && (
                            <p className="description">Supplier: {supplierData.name}</p>
                        )}
                        <p className="description">{productData.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
