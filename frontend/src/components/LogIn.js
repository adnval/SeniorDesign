import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

function LogIn(props) {

    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [formError, setFormError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [LoginFormData, setLoginFormData] = useState({
        "username": '',
        "password": '',
    });

    const inputHandler = (event) => {
        setLoginFormData({
            ...LoginFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const formData = new FormData();
        formData.append('username', LoginFormData.username);
        formData.append('password', LoginFormData.password);

        // Submit Data
        axios.post(baseUrl + 'customers/login/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setFormError(true);
                    setErrorMessage(response.data.msg);
                } else {
                    localStorage.setItem('customer_username', response.data.user); // Save username
                    localStorage.setItem('customer_id', response.data.customer_id); // Save customer ID
                    localStorage.setItem('customer_login', true);

                    setFormError(false);
                    setErrorMessage('');
                    window.location.href = '/customer/Dashboard'; // Redirect to dashboard
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                setFormError(true);
                setErrorMessage('An error occurred. Please try again.');
            });
    };

    const checkCustomer = localStorage.getItem('customer_login');
    if (checkCustomer) {
        window.location.href = '/customer/Dashboard';
    }

    const buttonEnable = (LoginFormData.username !== '') && (LoginFormData.password !== '');

    return (
        <>
            <div className='container mt-4'>
                <div className='card'>
                    <h4 className='card-header'>Log In</h4>
                    <div className="card-body">
                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" name="username" value={LoginFormData.username} onChange={inputHandler} className="form-control" id="username" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" name="password" value={LoginFormData.password} onChange={inputHandler} className="form-control" id="password" />
                            </div>
                            <button type="submit" disabled={!buttonEnable} className="btn btn-primary">Submit</button>
                            {formError &&
                                <p className="text-danger">{errorMessage}</p>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LogIn;
