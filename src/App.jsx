import React from 'react';
import styles from './styles/App.module.css'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BookingServices from "./pages/BookingServices";
import Header from "./shared/Header.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage"

function App() {
    return (
            <div className={styles.container}>
                    <Header/>

                <main>
                    <Routes>
                        <Route path="/services" element={<BookingServices />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </main>
            </div>

    );
}

export default App;
