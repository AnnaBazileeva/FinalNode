import React from 'react';
import {useEffect, useState} from 'react';
import styles from "../styles/BookingServices.module.css"

function BookingServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found, please login');

                const res = await fetch(`${API_BASE}/services`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('error loading services');
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
        <div className={styles.servicesContainer}>
            <h2>Services for booking</h2>
            <div className={styles.servicesGrid}>
                {services.map((service) => (
                    <div key={service._id} className={styles.serviceCard}>
                        {service.image && (
                            <img
                                src={service.image}
                                alt={service.serviceName}
                                className={styles.serviceImage}
                            />
                        )}
                        <h3>{service.serviceName}</h3>
                        <p>{service.description}</p>
                        <p><strong>Location:</strong> {service.location}</p>
                        <button
                            className={styles.bookButton}
                            onClick={() => handleBook(service)}
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