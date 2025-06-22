import React, { useState, useEffect } from 'react';
import styles from '../styles/AddService.module.css';
import { useNavigate } from 'react-router-dom';
import Location from "./Location";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const AddService = () => {
    const [userRole, setUserRole] = useState(null);
    const [serviceName, setServiceName] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [services, setServices] = useState([]);
    const [imageBase64, setImageBase64] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [latLng, setLatLng] = useState(null);

    const fetchMyServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/services`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                setServices(data.services);
            } else {
                console.error(data.message || 'Failed to fetch services');
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('You need to be logged in to add a service');
            navigate('/login');
            return;
        }

        if (userRole !== 'provider') {
            setErrorMessage('Only providers can add services');
            return;
        }

        const errors = [];
        if (!serviceName.trim()) errors.push('Service name is required');
        if (!company.trim()) errors.push('Company is required');
        if (!location.trim() && !latLng) errors.push('Location is required (either enter address or select on map)');

        if (errors.length > 0) {
            setErrorMessage(errors.join(', '));
            return;
        }

        if (imageBase64 && imageBase64.length > 500000) {
            setErrorMessage('Image size too large (max 500KB)');
            return;
        }

        const body = {
            serviceName,
            company,
            location: latLng ? `${latLng.lat},${latLng.lng}` : location,
            description,
            image: imageBase64
        };

        try {
            const res = await fetch(`${API_BASE}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                setServiceName('');
                setCompany('');
                setLocation('');
                setDescription('');
                setImageBase64('');
                alert('Service added');
                navigate('/services/myservices');
            } else {
                setErrorMessage(data.msg || data.message || 'Error adding service');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setErrorMessage('Network error. Please try again.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);
            fetchMyServices();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className={styles.container}>
            <h2>Add a Service</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Service name *</label>
                    <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Service name"
                        required
                        className={!serviceName ? styles.errorBorder : ''}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Company *</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company"
                        required
                        className={!company ? styles.errorBorder : ''}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Location *</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className={!location && !latLng ? styles.errorBorder : ''}
                    />
                    <small>Or select location on the map below</small>
                    <Location setLatLng={setLatLng}/>
                </div>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">Add Service</button>
            </form>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
        </div>
    );
};

export default AddService;