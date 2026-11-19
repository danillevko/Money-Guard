import { useState } from "react";
// Reuses the Add modal styles, so ETransaction.module.css can be deleted
import s from "./AddTransaction.module.css";
import CategorySelect from "../statistics/CategorySelect";
import CategorySuggestion from "../ai/CategorySuggestion";

function ETransaction({ isOpen, onClose, onSave, transaction }) {
    if (!isOpen || !transaction) {
        return null;
    }

    // key= resets the form state every time a different transaction is edited
    return (
        <EditForm
            key={transaction.id}
            transaction={transaction}
            onClose={onClose}
            onSave={onSave}
        />
    );
}

function EditForm({ transaction, onClose, onSave }) {
    const [sum, setSum] = useState(transaction.sum);
    const [date, setDate] = useState(transaction.date);
    const [comment, setComment] = useState(transaction.comment || "");
    const [type, setType] = useState(transaction.type);
    const [category, setCategory] = useState(transaction.category || "");

    function handleSubmit(e) {
        e.preventDefault();

        if (type === "Expense" && !category) {
            alert("Select a category");
            return;
        }

        onSave({
            ...transaction,
            type,
            category: type === "Income" ? "Income" : category,
            sum: Number(sum),
            date,
            comment
        });
        onClose();
    }

    return (
        <div className={s.overlay}>
            <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="editTransactionTitle">
                <button className={s.closeBtn} type="button" onClick={onClose} aria-label="Close">×</button>
                <h2 id="editTransactionTitle">Edit Transaction</h2>

                <div className={s.typeSwitch}>
                    <span className={type === "Income" ? s.active : ""}>Income</span>
                    <button
                        type="button"
                        className={s.switch}
                        aria-label="Switch between income and expense"
                        onClick={() => setType(type === "Income" ? "Expense" : "Income")}
                    >
                        <span className={type === "Expense" ? s.switchExpense : s.switchIncome}>
                            {type === "Income" ? "+" : "−"}
                        </span>
                    </button>
                    <span className={type === "Expense" ? s.active : ""}>Expense</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {type === "Expense" && (
                        <CategorySelect value={category} onChange={setCategory} />
                    )}

                    <div className={s.inputRow}>
                        <input
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={sum}
                            min="0.1"
                            step="0.1"
                            onChange={(e) => setSum(e.target.value)}
                            required
                        />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>

                    <input
                        className={s.comment}
                        type="text"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <CategorySuggestion
                        comment={comment}
                        type={type}
                        category={category}
                        onApply={setCategory}
                    />

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
