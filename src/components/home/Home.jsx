import { useState, lazy, Suspense } from "react";
import s from './Home.module.css';
import { GoPlus } from "react-icons/go";
import Header from './Header';
import Sidebar from "./Sidebar";
import Transactions from "./Transactions";
import AddTransaction from "./AddTransaction";
import ETransaction from './ETransaction';

// Heavy pages are downloaded only when opened (Recharts lives inside Stats)
const Stats = lazy(() => import("../statistics/Stats"));
const AiAssistant = lazy(() => import("../ai/AiAssistant"));

const START_BALANCE = 1000000;

function loadTransactions() {
    try {
        return JSON.parse(localStorage.getItem('transactions')) || [];
    } catch {
        return [];
    }
}

function Home({ user, onLogout }) {
    const [transactions, setTransactions] = useState(loadTransactions);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [page, setPage] = useState("home");
    const [showLogout, setShowLogout] = useState(false);

    const save = (list) => {
        setTransactions(list);
        localStorage.setItem('transactions', JSON.stringify(list));
    };

    const addTransaction = (newTransaction) => {
        save([...transactions, newTransaction]);
        setShowModal(false);
    };

    const deleteTransaction = (id) => {
        save(transactions.filter((item) => item.id !== id));
    };

    const handleEdit = (updated) => {
        save(transactions.map((item) => (item.id === updated.id ? updated : item)));
        setShowEdit(false);
        setSelectedTransaction(null);
    };

    const balance = transactions.reduce(
        (sum, item) => (item.type === 'Income' ? sum + Number(item.sum) : sum - Number(item.sum)),
        START_BALANCE
    );

    let content;
    if (page === "home") {
        content = (
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
                    aria-label="Add transaction"
                >
                    <GoPlus />
                </button>
            </>
        );
    } else if (page === "stats") {
        content = (
            <Suspense fallback={<p className={s.loading}>Loading…</p>}>
                <Stats transactions={transactions} />
            </Suspense>
        );
    } else {
        content = (
            <Suspense fallback={<p className={s.loading}>Loading…</p>}>
                <AiAssistant transactions={transactions} balance={balance} />
            </Suspense>
        );
    }

    return (
        <div className={s.home}>
            <Header user={user} onLogout={() => setShowLogout(true)} />
            <div className={s.homeContent}>
                <Sidebar balance={balance} page={page} onNavigate={setPage} />
                <main className={page === "ai" ? `${s.mainContent} ${s.mainChat}` : s.mainContent}>
                    {content}
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
                    <div className={s.logoutModal} role="dialog" aria-modal="true">
                        <img src={`${import.meta.env.BASE_URL}Money-Guard.png`} alt="Money Guard" />
                        <h2>Money Guard</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className={s.logoutActions}>
                            <button className={s.logoutConfirm} onClick={onLogout}>
                                LOGOUT
                            </button>
                            <button className={s.logoutCancel} onClick={() => setShowLogout(false)}>
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
