import s from './Home.module.css';
import { MdEdit } from "react-icons/md";

function Transactions({ transactions, onDelete, onEdit }) {
    if (transactions.length === 0) {
        return <p className={s.empty}>No transactions yet. Tap + to add your first one.</p>;
    }

    return (
        <div className={s.transactions}>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Comment</th>
                        <th>Sum</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) => (
                        <tr key={item.id} className={item.type === 'Income' ? s.rowIncome : s.rowExpense}>
                            <td data-label="Date">{item.date}</td>
                            <td data-label="Type">{item.type}</td>
                            <td data-label="Category">{item.category}</td>
                            <td data-label="Comment">{item.comment}</td>
                            <td data-label="Sum">{item.sum}</td>
                            <td className={s.tdBtn}>
                                <button className={s.editBtn} onClick={() => onEdit(item)} aria-label="Edit transaction"><MdEdit /></button>
                                <button className={s.deleteBtn} onClick={() => onDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transactions;
