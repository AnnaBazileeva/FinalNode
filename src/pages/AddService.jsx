import React, {useState, useEffect} from 'react';
import styles from '../styles/AddService.module.css';
import {useNavigate} from 'react-router-dom';
import Location from "./Location"

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AddService = () => {
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
            const res = await fetch(`${API_BASE}/services`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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

        const body = {
            serviceName,
            company,
            location: latLng ? `${latLng.lat},${latLng.lng}` : location,
            description,
            image: imageBase64
        };

        try {
            const res = await fetch(`${API_BASE}/services`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`
                }, body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                await fetchMyServices();
                setServiceName('');
                setCompany('');
                setLocation('');
                setDescription('');
                setImageBase64('');
                alert('Service added');
                navigate('/services');
            } else {
                setErrorMessage(data.msg || data.message || 'Error adding service');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setErrorMessage('Network error. Please try again.');
        }
    };

    useEffect(() => {
        fetchMyServices();
    }, []);

    return (<div className={styles.container}>
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
                    placeholder="Location"/>
                <label>Select location on the map:</label>
                <Location setLatLng={setLatLng}/>


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
            {errorMessage && (<p style={{color: 'red', marginTop: '1rem'}}>{errorMessage}</p>)}
        </div>);
};

export default AddService;
