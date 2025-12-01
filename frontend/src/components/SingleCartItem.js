import React from 'react';

function SingleCartItem({ item, onUpdateQuantity, onRemove }) {
    const { product, quantity } = item;

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity > 0) {
            onUpdateQuantity(product.id, newQuantity);
        }
    };

    return (
        <div className="col-12 mb-4">
            <div className="card h-100">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={product.image} className="cart-image img-fluid rounded-start" alt={product.title} />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{product.product_name}</h5>
                            <p className="card-text">Price: ${product.price}</p>
                            <div className="input-group mb-3">
                                <input
                                    type="number"
                                    className="form-control quantity-button"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                />
                                <button
                                    className="btn btn-danger"
                                    onClick={() => onRemove(product.id)}
                                >
                                    Remove
                                </button>
                            </div>
                            <p className="card-text">Total: ${(product.price * quantity).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCartItem;

