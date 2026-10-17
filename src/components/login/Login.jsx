import { useState, useEffect, useMemo } from "react";
import Register from "../register/Register";
import s from './Login.module.css';
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import Home from "../home/Home";
function LoginModal() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const login = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email === email && user.password === password) {
            setCurrentUser(user)
            setIsLoggedIn(true);
        }
    }
    if (showRegister) {
        return (
            <Register onLogin={() => setShowRegister(false)} />
        )
    }
    if(currentUser){
        return(
            <Home user={currentUser} onLogout={() => setCurrentUser(null)}/>
        )
    }

    return (
        <div className={s.body}>
            <div className={s.container}>
                <div className={s.loginCard}>
                    <div className={s.logoWrapper}>
                        <img src="/Money-Guard.png" alt="logo" className={s.logo} />
                        <h1 className={s.logoTitle}>Money Guard</h1>
                    </div>
                    <form onSubmit={login}>
                        <div className={s.inputGroup}>
                            <MdEmail />
                            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={s.inputGroup}>
                            <IoIosLock />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button className={s.loginBtn} type="submit">log in</button>
                        <button className={s.registerBtn} type="button" onClick={() => { setShowRegister(true) }}>register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LoginModal