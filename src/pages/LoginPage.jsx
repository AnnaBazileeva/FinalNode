import React, { useState } from "react";
import styles from "../styles/Login.module.css";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("customer");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin ? "/api/auth/login" : "/api/auth/register";
        const payload = isLogin
            ? { email, password, role }
            : { name, email, password, role };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
            alert(isLogin ? `Welcome, ${role}!` : "Registration successful!");
        } else {
            alert(data.message || "Request failed");
        }
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>{isLogin ? "Login" : "Register"}</h2>

                <div className={styles.roleSwitch}>
                    <button
                        type="button"
                        onClick={() => setRole("customer")}
                        className={`${styles.roleButton} ${role === "customer" ? styles.activeCustomer : ""}`}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("provider")}
                        className={`${styles.roleButton} ${role === "provider" ? styles.activeProvider : ""}`}
                    >
                        Provider
                    </button>
                </div>

                {!isLogin && (
                    <label className={`${styles.label} ${!isLogin ? "" : styles.hiddenField}`}>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                            required={!isLogin}
                            disabled={isLogin}
                        />
                    </label>
                )}

                <label className={styles.label}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>

                <label className={styles.label}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>

                <button type="submit" className={styles.loginButton}>
                    {isLogin ? "Login" : "Register"}
                </button>

                <div className={styles.switch}>
                    {isLogin ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={styles.linkButton}
                            >
                                Register here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={styles.linkButton}
                            >
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
