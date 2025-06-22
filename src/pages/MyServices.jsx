import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import  styles from  "../styles/BookingServices.module.css"

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const MyServices = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/services/myservices`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setServices(data.services);
            } else {
                console.error('Failed to fetch services');
            }
        };
        fetchServices();
    }, []);

    return (
        <div>
            <h2>My Services</h2>
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
                        <Link to={`/services/edit/${service._id}`}>
                            <button className={styles.bookButton}>Edit</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyServices;
