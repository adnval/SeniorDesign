import axios from "axios";
import { useState } from "react";

function Register() {
    const baseUrl = 'http://127.0.0.1:8000/api/';
    const [formError, setFormError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [RegisterFormData, setRegisterFormData] = useState({
        "name": '',
        "username": '',
        "password": '',
    });

    const inputHandler = (event) => {
        setRegisterFormData({
            ...RegisterFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const formData = new FormData();
        formData.append('name', RegisterFormData.name);
        formData.append('username', RegisterFormData.username);
        formData.append('password', RegisterFormData.password);

        // Submit Data
        axios.post(baseUrl + 'customers/register/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setFormError(true);
                    setErrorMessage(response.data.msg);
                } else {
                    console.log(response.data);
                    localStorage.setItem('customer_username', response.data.user); // Ensure username is accessed correctly
                    localStorage.setItem('customer_login', true);
                    localStorage.setItem('customer_id', response.data.customer);

                    setFormError(false);
                    setErrorMessage('');
                    window.location.href = '/Dashboard'; // Redirect to dashboard
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                // Handle error here, if needed
                setFormError(true);
                setErrorMessage('An error occurred. Please try again.');
            });
    };

    const buttonEnable = (RegisterFormData.username !== '') && (RegisterFormData.password !== '') && (RegisterFormData.name !== '');
    const checkCustomer = localStorage.getItem('customer_login');
    if (checkCustomer) {
        window.location.href = '/Dashboard';
    }
    return (
        <div className='container mt-4'>
            <div className='card'>
                <h4 className='card-header'>Register</h4>
                <div className="card-body">
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input type="text" name="name" value={RegisterFormData.name} onChange={inputHandler} className="form-control" id="name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" name="username" value={RegisterFormData.username} onChange={inputHandler} className="form-control" id="username" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" name="password" value={RegisterFormData.password} onChange={inputHandler} className="form-control" id="password" />
                        </div>
                        <button type="submit" disabled={!buttonEnable} className="btn btn-primary">Submit</button>
                        {formError &&
                            <p className="text-danger">{errorMessage}</p>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;
