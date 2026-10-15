import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import s from './Register.module.css';

function Register({ onLogin }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const register = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Password do not match');
            return;
        }
        const user = { name, email, password };
        localStorage.setItem('user', JSON.stringify(user));
        onLogin();
    }
    return (
        <div className={s.authPage}>
            <div className={s.auth}>
                <div className={s.logoWrapper}>
                    <img src="/Money-Guard.png" alt="logo" className={s.logo} />
                    <h1 className={s.logoTitle}>Money Guard</h1>
                </div>
                <form onSubmit={register}>
                    <div className={s.inputGroup}>
                        <MdPerson />
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={s.inputGroup}>
                        <MdEmail />
                        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={s.inputGroup}>
                        <IoIosLock />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={s.inputGroup}>
                        <IoIosLock />
                        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className={s.loginBtn} type="submit">register</button>
                    <button className={s.registerBtn} type="button" onClick={onLogin}>log in</button>
                </form>
            </div>
        </div>
    )
}
export default Register