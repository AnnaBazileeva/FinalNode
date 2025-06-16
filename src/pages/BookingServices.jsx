import React from 'react';
import {useEffect, useState} from 'react';

function BookingServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE}/services`);
                if (!res.ok) {
                    throw new Error('error for loading services');
                }
                const data = await res.json();
                setServices(data.services || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [API_BASE]);

    const handleBook = (service) => {
        alert(`You booked: ${service.title}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{padding: '1rem'}}>
            <h2>Services for booking</h2>
            <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'}}>
                {services.map((service) => (
                    <div
                        key={service._id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '1rem',
                            background: '#f9f9f9'
                        }}
                    >
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <p><strong>Price:</strong> {service.price} руб.</p>
                        <p><strong>Location:</strong> {service.location}</p>
                        <button
                            onClick={() => handleBook(service)}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Booking
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingServices;