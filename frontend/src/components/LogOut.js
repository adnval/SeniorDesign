import { useState, useEffect } from 'react';

function LogOut(props) {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        localStorage.removeItem('customer_login');
        localStorage.removeItem('customer_username');
        localStorage.removeItem('customer_id');


        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId);
                    window.location.href = '/LogIn';
                }
                return prevCountdown - 1;
            });
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container mt-4">
            <div className="alert alert-info">
                You have been logged out. Redirecting to login in {countdown} seconds...
            </div>
        </div>
    );
}

export default LogOut;
