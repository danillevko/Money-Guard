import s from './Home.module.css';
import { MdEdit } from "react-icons/md";
function Transactions({ transactions, onDelete }) {
    return (
        <div className={s.transactions}>
            <table>
                <thead>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Comment</th>
                    <th>Sum</th>
                    <th></th>
                </thead>

                <tbody>
                    {
                        transactions.map((item, index) =>(
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.type}</td>
                                <td>{item.category}</td>
                                <td>{item.comment}</td>
                                <td>{item.sum}</td>
                                <td>
                                    <button className={s.editBtn}><MdEdit /></button>
                                    <button className={s.deleteBtn} onClick={() => onDelete(index)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
export default Transactions