import React from "react";
import styles from "../styles/About.module.css";

const About = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>About This App</h1>
            <p className={styles.text}>
                This application is designed to help service providers and clients connect in a simple and effective way.
                Providers can create and manage their services, including details such as name, company, location, and description.
                Clients can browse available services and book them directly through the platform.
            </p>
            <p className={styles.text}>
                Whether you offer haircuts, language lessons, or repair services — this app gives you the tools to present your business
                and reach new clients easily.
            </p>
            <p className={styles.author}>Author: Anna Bazileeva</p>
        </div>
    );
};

export default About;
