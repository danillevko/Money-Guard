import { useState } from "react";
import Register from "../register/Register";
import Home from "../home/Home";
import s from './Login.module.css';
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";

function LoginModal() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const login = (e) => {
        e.preventDefault();

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch {
            user = null;
        }

        if (user && user.email === email && user.password === password) {
            setError("");
            setCurrentUser(user);
        } else {
            setError("Wrong e-mail or password");
        }
    };

    if (showRegister) {
        return <Register onLogin={() => setShowRegister(false)} />;
    }

    if (currentUser) {
        return <Home user={currentUser} onLogout={() => setCurrentUser(null)} />;
    }

    return (
        <div className={s.body}>
            <div className={s.container}>
                <div className={s.loginCard}>
                    <div className={s.logoWrapper}>
                        <img src={`${import.meta.env.BASE_URL}Money-Guard.png`} alt="logo" className={s.logo} />
                        <h1 className={s.logoTitle}>Money Guard</h1>
                    </div>
                    <form className={s.form} onSubmit={login}>
                        <div className={s.inputGroup}>
                            <MdEmail />
                            <input
                                type="email"
                                placeholder="E-mail"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={s.inputGroup}>
                            <IoIosLock />
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className={s.error} role="alert">{error}</p>}
                        <button className={s.loginBtn} type="submit">log in</button>
                        <button className={s.registerBtn} type="button" onClick={() => setShowRegister(true)}>register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
