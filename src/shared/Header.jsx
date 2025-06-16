import React, {useState, useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";
import styles from "../styles/Header.module.css";


const Header = () => {
    const location = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setTitle("Home");
                break;
            case "/about":
                setTitle("About");
                break;
            case "/services":
                setTitle("Services");
                break;
            case "/login":
                setTitle("Login");
                break;
            default:
                setTitle("Not Found");
        }
    }, [location]);

    return (
        <header className={styles.header}>

            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({isActive}) =>
                        isActive ? styles.active : styles.inactive
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/about"
                    className={({isActive}) =>
                        isActive ? styles.active : styles.inactive
                    }
                >
                    About
                </NavLink>
                <NavLink
                    to="/services"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.inactive
                    }
                >
                    Services
                </NavLink>
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.inactive
                    }
                >
                    Login
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;