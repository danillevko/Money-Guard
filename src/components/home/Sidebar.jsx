import s from './Home.module.css';
import { MdHome } from "react-icons/md";
import { MdOutlineQueryStats } from "react-icons/md";
function Sidebar({balance}){
    return(
        <aside className={s.sidebar}>
            <nav className={s.navigation}>
                <button><MdHome />Home</button>
                <button><MdOutlineQueryStats />Statistics</button>
            </nav>
            <div className={s.balance}>
                <p>your balance</p>
                <h2>$ {balance}</h2>
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
    )
}
export default Sidebar