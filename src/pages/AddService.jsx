import React, { useState, useEffect } from 'react';
import styles from '../styles/AddService.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AddService = () => {
    const [serviceName, setServiceName] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [services, setServices] = useState([]);

    const fetchMyServices = async () => {
        try {
            const res = await fetch(`${API_BASE}/services`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setServices(data.services);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { serviceName, company, location, description };

        try {
            const res = await fetch(`${API_BASE}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await fetchMyServices();
                setServiceName('');
                setCompany('');
                setLocation('');
                setDescription('');
                alert('Service added');
            } else {
                const data = await res.json();
                alert(data.message || 'Error');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMyServices();
    }, []);

    return (
        <div className={styles.container}>
            <h2>Add a Service</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Service name"
                    required
                />
                <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    required
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <button type="submit">Add Service</button>
            </form>

            <h3>Your Services</h3>
            <select className={styles.dropdown}>
                {services.map(service => (
                    <option key={service._id}>{service.serviceName}</option>
                ))}
            </select>
        </div>
    );
};

export default AddService;
