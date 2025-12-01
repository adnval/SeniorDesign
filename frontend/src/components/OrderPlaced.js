import { useState, useEffect } from 'react';

function OrderPlaced(props) {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {


        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId);
                    window.location.href = '/Dashboard';
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
                Your Order has been placed! Redirecting to your dashboard in {countdown} seconds...
            </div>
        </div>
    );
}

export default OrderPlaced;