import React, {useState} from 'react';
import styles from "../styles/HomePage.module.css";

const Home = ({ isLoading, error }) => (
    <div className={styles.homeContainer}>
        <h2 className={styles.title}>Services App</h2>
        <p className={styles.instruction}>
            Easily create or book services in just a few clicks.
        </p>

        {isLoading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
    </div>
);

export default Home;
