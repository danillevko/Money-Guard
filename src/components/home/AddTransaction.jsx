
// import { useState } from "react";
// import s from "./AddTransaction.module.css";

// function AddTransaction({ onClose, onAdd }) {
//     const [type, setType] = useState("Income");
//     const [sum, setSum] = useState("");
//     const [date, setDate] = useState(
//         new Date().toLocaleDateString("en-CA")
//     );
//     const [comment, setComment] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!sum || Number(sum) <= 0 || !date) {
//             return;
//         }

//         const newTransaction = {
//             id: Date.now(),
//             type: type,
//             sum: Number(sum),
//             date: date,
//             category: type === "Income" ? "Income" : "Expense",
//             comment: comment
//         };

//         onAdd(newTransaction);
//     };

//     return (
//         <div className={s.overlay}>
//             <div
//                 className={s.modal}
//                 role="dialog"
//                 aria-modal="true"
//                 aria-labelledby="addTransactionTitle"
//             >
//                 <button
//                     className={s.closeBtn}
//                     onClick={onClose}
//                     type="button"
//                     aria-label="Close"
//                 >
//                     ×
//                 </button>

//                 <h2 id="addTransactionTitle">Add Transaction</h2>

//                 <div className={s.typeSwitch}>
//                     <span className={type === "Income" ? s.active : ""}>
//                         Income
//                     </span>

//                     <button
//                         type="button"
//                         className={s.switch}
//                         onClick={() =>
//                             setType(type === "Income" ? "Expense" : "Income")
//                         }
//                     >
//                         <span className={type === "Expense" ? s.switchExpense : s.switchIncome}>
//                             {type === "Income" ? "+" : "−"}
//                         </span>
//                     </button>

//                     <span className={type === "Expense" ? s.active : ""}>
//                         Expense
//                     </span>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className={s.inputRow}>
//                         <input
//                             type="number"
//                             placeholder="0.00"
//                             value={sum}
//                             min="0.1"
//                             step="0.1"
//                             onChange={(e) => setSum(e.target.value)}
//                             required
//                         />

//                         <input
//                             type="date"
//                             value={date}
//                             onChange={(e) => setDate(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <input
//                         className={s.comment}
//                         type="text"
//                         placeholder="Comment"
//                         value={comment}
//                         onChange={(e) => setComment(e.target.value)}
//                     />

//                     <div className={s.buttons}>
//                         <button type="submit" className={s.addBtn}>
//                             ADD
//                         </button>

//                         <button
//                             type="button"
//                             className={s.cancelBtn}
//                             onClick={onClose}
//                         >
//                             CANCEL
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default AddTransaction;
import { useState } from "react";
import s from "./AddTransaction.module.css";
import CategorySelect from "../statistics/CategorySelect";

function AddTransaction({ onClose, onAdd }) {
    const [type, setType] = useState("Income");
    const [sum, setSum] = useState("");
    const [date, setDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [comment, setComment] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!sum || Number(sum) <= 0 || !date) {
            return;
        }

        if (type === "Expense" && !category) {
            alert("Select a category");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type: type,
            sum: Number(sum),
            date: date,
            category: type === "Income" ? "Income" : category,
            comment: comment
        };

        onAdd(newTransaction);
    };

    return (
        <div className={s.overlay}>
            <div
                className={s.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="addTransactionTitle"
            >
                <button
                    className={s.closeBtn}
                    onClick={onClose}
                    type="button"
                    aria-label="Close"
                >
                    ×
                </button>

                <h2 id="addTransactionTitle">Add Transaction</h2>

                <div className={s.typeSwitch}>
                    <span className={type === "Income" ? s.active : ""}>
                        Income
                    </span>

                    <button
                        type="button"
                        className={s.switch}
                        onClick={() =>
                            setType(type === "Income" ? "Expense" : "Income")
                        }
                    >
                        <span className={type === "Expense" ? s.switchExpense : s.switchIncome}>
                            {type === "Income" ? "+" : "−"}
                        </span>
                    </button>

                    <span className={type === "Expense" ? s.active : ""}>
                        Expense
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {type === "Expense" && (
                        <CategorySelect value={category} onChange={setCategory} />
                    )}

                    <div className={s.inputRow}>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={sum}
                            min="0.1"
                            step="0.1"
                            onChange={(e) => setSum(e.target.value)}
                            required
                        />

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <input
                        className={s.comment}
                        type="text"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <div className={s.buttons}>
                        <button type="submit" className={s.addBtn}>
                            ADD
                        </button>

                        <button
                            type="button"
                            className={s.cancelBtn}
                            onClick={onClose}
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTransaction;