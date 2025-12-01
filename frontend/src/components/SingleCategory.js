import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';



import React from 'react';


function SingleCategory(props) {
    return (
        <div className="col">
            <div className="card h-100">
                <img src={props.category.image} className="card-img-top" alt="Category" />
                <div className="card-body">
                    <h5 className="card-title">
                        <Link to={`/category/${props.category.id}`}>
                            {props.category.name}
                        </Link>
                    </h5>
                </div>
            </div>
        </div>
    );
}

export default SingleCategory;
