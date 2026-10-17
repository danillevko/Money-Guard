import s from './Home.module.css';
import { RxExit } from "react-icons/rx";
function Header({user, onLogout}){
    return(
        <header className={s.header}>
            <div className={s.headerLogo}>
                <img src="/Money-Guard.png" alt="" />
                <h2>Money Guard</h2>
            </div>
            <div className={s.headerUser}>
                <span>{user.name}</span>
                <button onClick={onLogout}><RxExit />Exit</button>
            </div>
        </header>
    )
}
export default Header