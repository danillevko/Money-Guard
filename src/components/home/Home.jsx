import { useState, useEffect } from "react";
import s from './Home.module.css';
import { GoPlus } from "react-icons/go";
import Header from './Header'
import Sidebar from "./Sidebar";
import Transactions from "./Transactions";
function Home({ user, onLogout }) {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem('transactions');
        if(saved){
            setTransactions(JSON.parse(saved));
        }
    }, []);
    const addTransaction = (newTransaction) => {
        const update = [...transactions, newTransaction];
        setTransactions(update);
        localStorage.setItem('transactions', JSON.stringify(update));
        setShowModal(false);
    }
    const deleteTransaction = (index) => {
        const update = transactions.filter((item, i) => i !== index)
        setTransactions(update);
        localStorage.setItem('transactions', JSON.stringify(update));
    }
    let balance = 1000000;
    transactions.forEach((item) => {
        if(item.type === 'Income'){
            balance = balance + item.sum;
        } else{
            balance = balance - item.sum;
        }
    })
    return(
        <div className={s.home}>
            <Header user={user} onLogout={onLogout}/>
            <div className={s.homeContent}>
                <Sidebar balance={balance}/>
                <main className={s.mainContent}>
                    <Transactions transactions={transactions} onDelete={deleteTransaction}/>
                    <button className={s.addBtn} onClick={() => setShowModal(true)}><GoPlus /></button>
                </main>
            </div>
        </div>
    )
}
export default Home