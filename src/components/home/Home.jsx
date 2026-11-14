import { useState, useEffect } from "react";
import s from './Home.module.css';
import { GoPlus } from "react-icons/go";
import Header from './Header';
import Sidebar from "./Sidebar";
import Transactions from "./Transactions";
import AddTransaction from "./AddTransaction";
import ETransaction from './ETransaction';
import Stats from "../statistics/Stats";

function Home({ user, onLogout }) {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [page, setPage] = useState("home");
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('transactions');
        if (saved) {
            setTransactions(JSON.parse(saved));
        }
    }, []);

    const addTransaction = (newTransaction) => {
        const update = [...transactions, newTransaction];

        setTransactions(update);
        localStorage.setItem('transactions', JSON.stringify(update));
        setShowModal(false);
    };

    const deleteTransaction = (index) => {
        const update = transactions.filter((item, i) => i !== index);

        setTransactions(update);
        localStorage.setItem('transactions', JSON.stringify(update));
    };

    let balance = 1000000;

    transactions.forEach((item) => {
        if (item.type === 'Income') {
            balance = balance + Number(item.sum);
        } else {
            balance = balance - Number(item.sum);
        }
    });

    function handleEdit(updatedTransaction) {
        const updatedTransactions = transactions.map((item) => {
            if (item.id === updatedTransaction.id) {
                return updatedTransaction;
            }

            return item;
        });

        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        setShowEdit(false);
        setSelectedTransaction(null);
    }

    return (
        <div className={s.home}>
            <Header user={user} onLogout={() => setShowLogout(true)} />
            <div className={s.homeContent}>
                <Sidebar balance={balance} onNavigate={setPage} />
                <main className={s.mainContent}>
                    {page === "home" ? (
                        <>
                            <Transactions
                                transactions={transactions}
                                onDelete={deleteTransaction}
                                onEdit={(transaction) => {
                                    setSelectedTransaction(transaction);
                                    setShowEdit(true);
                                }}
                            />

                            <button
                                className={s.addBtn}
                                onClick={() => setShowModal(true)}
                            >
                                <GoPlus />
                            </button>
                        </>
                    ) : (
                        <Stats transactions={transactions} />
                    )}
                </main>
            </div>
            {showModal && (
                <AddTransaction
                    onClose={() => setShowModal(false)}
                    onAdd={addTransaction}
                />
            )}
            <ETransaction
                isOpen={showEdit}
                onClose={() => {
                    setShowEdit(false);
                    setSelectedTransaction(null);
                }}
                onSave={handleEdit}
                transaction={selectedTransaction}
            />
            {showLogout && (
                <div className={s.logoutOverlay}>
                    <div className={s.logoutModal}>
                        <img src="/Money-Guard.png" alt="Money Guard" />
                        <h2>Money Guard</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className={s.logoutActions}>
                            <button
                                className={s.logoutConfirm}
                                onClick={onLogout}
                            >
                                LOGOUT
                            </button>
                            <button
                                className={s.logoutCancel}
                                onClick={() => setShowLogout(false)}>
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
