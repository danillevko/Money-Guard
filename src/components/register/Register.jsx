import { useState } from "react";
import { MdPerson, MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import s from './Register.module.css';

function Register({ onLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const register = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const user = { name, email, password };
        localStorage.setItem('user', JSON.stringify(user));
        onLogin();
    };

    return (
        <div className={s.authPage}>
            <div className={s.auth}>
                <div className={s.logoWrapper}>
                    <img src={`${import.meta.env.BASE_URL}Money-Guard.png`} alt="logo" className={s.logo} />
                    <h1 className={s.logoTitle}>Money Guard</h1>
                </div>
                <form className={s.form} onSubmit={register}>
                    <div className={s.inputGroup}>
                        <MdPerson />
                        <input type="text" placeholder="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className={s.inputGroup}>
                        <MdEmail />
                        <input type="email" placeholder="E-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className={s.inputGroup}>
                        <IoIosLock />
                        <input type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className={s.inputGroup}>
                        <IoIosLock />
                        <input type="password" placeholder="Confirm password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button className={s.loginBtn} type="submit">register</button>
                    <button className={s.registerBtn} type="button" onClick={onLogin}>log in</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
