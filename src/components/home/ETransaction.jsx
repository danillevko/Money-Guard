import { useState, useEffect } from "react";
import s from "./ETransaction.module.css";
import CategorySelect from "../statistics/CategorySelect";

function ETransaction({ isOpen, onClose, onSave, transaction }) {
    const [sum, setSum] = useState('');
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [type, setType] = useState("Income");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (transaction) {
            setSum(transaction.sum);
            setDate(transaction.date);
            setComment(transaction.comment || "");
            setType(transaction.type);
            setCategory(transaction.category || "");
        }
    }, [transaction]);

    if (!isOpen || !transaction) {
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (type === "Expense" && !category) {
            alert("Select a category");
            return;
        }

        const updateTransaction = {
            ...transaction,
            type: type,
            category: type === "Income" ? "Income" : category,
            sum: Number(sum),
            date: date,
            comment: comment
        };
        onSave(updateTransaction);
        onClose();
    }

    return (
        <div className={s.overlay}>
            <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="addTransactionTitle">
                <button className={s.close} type="button" onClick={onClose}>x</button>
                <h2>Edit Transaction</h2>
                <div className={s.typeSwitch}>
                    <span className={type === "Income" ? s.active : ""}>Income</span>
                    <button type="button" className={s.switch} onClick={() => setType(type === "Income" ? "Expense" : "Income")}>
                        <span className={type === "Expense" ? s.switchExpense : s.switchIncome}>
                            {type === "Income" ? "+" : "-"}
                        </span>
                    </button>
                    <span className={type === "Expense" ? s.active : ""}>Expense</span>
                </div>
                <form onSubmit={handleSubmit}>
                    {type === "Expense" && (
                        <CategorySelect value={category} onChange={setCategory} />
                    )}

                    <div className={s.inputRow}>
                        <input type="number" placeholder="0.00" value={sum} min="0.1" step="0.1" onChange={(e) => setSum(e.target.value)} required />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <input className={s.comment} type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                    <div className={s.buttons}>
                        <button type="submit" className={s.addBtn}>SAVE</button>
                        <button type="button" className={s.cancelBtn} onClick={onClose}>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ETransaction;