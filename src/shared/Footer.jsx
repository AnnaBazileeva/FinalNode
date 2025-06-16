import styles from '../styles/Footer.module.css';
import logo from "../assets/logo.png";
import React from "react";


const Footer = () => (
    <footer className={styles.footer}>
        <p>© 2025 Service App. Made by Anna Bazileeva</p>
        <p>Node final project  <img src={logo} alt="logo" className={styles.logo} />
            <a href="https://codethedream.org" target="_blank" rel="noreferrer">
                CTD
            </a> school
        </p>
    </footer>
);

export default Footer;