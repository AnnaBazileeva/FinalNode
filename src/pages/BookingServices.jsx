import React from 'react';
import {useEffect, useState} from 'react';
import styles from "../styles/BookingServices.module.css"

function BookingServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 2;

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Please login');

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

    useEffect(() => {
        const filtered = services.filter((s) =>
            s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            s.location.toLowerCase().includes(locationSearch.toLowerCase())
        );
        setFilteredServices(filtered);
        setCurrentPage(1);
    }, [searchTerm, locationSearch, services]);


    const handleBook = async (service) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found, please login');

            const bookingDate = service.selectedDate || new Date().toISOString();

            const res = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    service: service._id,
                    date: bookingDate
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Booking failed');
            }

            alert(`You booked: ${service.serviceName}`);
            setSelectedService(null);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.servicesContainer}>
            <h2>Services for booking</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by service name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Search by location"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.servicesGrid}>
                {currentServices.map((service) => (
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
                            onClick={() => setSelectedService(service)}
                        >
                            Booking
                        </button>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
            {selectedService && (
                <div className={styles.bookingDetails}>
                    <h3>Booking for: {selectedService.serviceName}</h3>
                    <p>{selectedService.description}</p>
                    <p><strong>Location:</strong> {selectedService.location}</p>

                    <input
                        type="date"
                        onChange={(e) => {
                            const newDate = new Date(e.target.value).toISOString();
                            setSelectedService((prev) => ({...prev, selectedDate: newDate}));
                        }}
                    />

                    <button
                        className={styles.bookButton}
                        onClick={() => handleBook(selectedService)}
                    >
                        Confirm Booking
                    </button>
                    <button onClick={() => setSelectedService(null)}>Cancel</button>
                </div>
            )}

        </div>
    );
}

export default BookingServices;