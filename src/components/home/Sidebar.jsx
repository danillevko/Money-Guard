import s from './Home.module.css';
import { MdHome, MdOutlineQueryStats } from "react-icons/md";

const money = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });

function Sidebar({ balance, page, onNavigate }) {
    return (
        <aside className={s.sidebar}>
            <nav className={s.navigation}>
                <button
                    className={page === "home" ? s.navActive : ""}
                    onClick={() => onNavigate("home")}
                >
                    <MdHome /><span>Home</span>
                </button>
                <button
                    className={page === "stats" ? s.navActive : ""}
                    onClick={() => onNavigate("stats")}
                >
                    <MdOutlineQueryStats /><span>Statistics</span>
                </button>
            </nav>

            <div className={s.balance}>
                <p>your balance</p>
                <h2>$ {money(balance)}</h2>
            </div>

            <div className={s.currency}>
                <table>
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Purchase</th>
                            <th>Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>USD</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>EUR</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </aside>
    );
}

export default Sidebar;
