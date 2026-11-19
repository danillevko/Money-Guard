import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import s from "./Stats.module.css";
import { CATEGORIES } from "../categories";
import AiInsights from "../ai/AiInsights";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const YEARS = [2022, 2023, 2024, 2025, 2026, 2027, 2028];

function money(number) {
    return Number(number).toFixed(2);
}

function Statistics({ transactions }) {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth()); // 0-11
    const [year, setYear] = useState(now.getFullYear());
    const [active, setActive] = useState(-1);

    // only transactions of the chosen month and year
    const monthTransactions = transactions.filter((item) => {
        const itemYear = Number(item.date.slice(0, 4));
        const itemMonth = Number(item.date.slice(5, 7)) - 1;
        return itemYear === year && itemMonth === month;
    });

    // sum for every category (expenses only)
    const categories = CATEGORIES.map((category) => {
        let sum = 0;
        monthTransactions.forEach((item) => {
            if (item.type === "Expense" && item.category === category.name) {
                sum += Number(item.sum);
            }
        });
        return { ...category, sum };
    });

    const expenses = categories.reduce((total, category) => total + category.sum, 0);

    const income = monthTransactions.reduce(
        (total, item) => (item.type === "Income" ? total + Number(item.sum) : total),
        0
    );

    const centerName = active >= 0 ? categories[active].name : "Total";
    const centerSum = active >= 0 ? categories[active].sum : expenses;

    // tap again to deselect (touch screens have no hover)
    const toggle = (index) => setActive((current) => (current === index ? -1 : index));

    return (
        <section className={s.statistics}>
            <h2 className={s.title}>Statistics</h2>

            <AiInsights transactions={transactions} year={year} month={month} />

            <div className={s.content}>
                <div className={s.chartBox}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {expenses === 0 ? (
                                // empty gray ring when there are no expenses
                                <Pie
                                    data={[{ value: 1 }]}
                                    dataKey="value"
                                    innerRadius="73%"
                                    outerRadius="100%"
                                    stroke="none"
                                    isAnimationActive={false}
                                >
                                    <Cell fill="rgba(255,255,255,0.15)" />
                                </Pie>
                            ) : (
                                <Pie
                                    data={categories}
                                    dataKey="sum"
                                    nameKey="name"
                                    innerRadius="73%"
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={2}
                                    stroke="none"
                                    onMouseEnter={(data, index) => setActive(index)}
                                    onMouseLeave={() => setActive(-1)}
                                    onClick={(data, index) => toggle(index)}
                                >
                                    {categories.map((category) => (
                                        <Cell key={category.name} fill={category.color} />
                                    ))}
                                </Pie>
                            )}
                        </PieChart>
                    </ResponsiveContainer>

                    <p className={s.chartTotal}>
                        {centerName}
                        <span>$ {money(centerSum)}</span>
                    </p>
                </div>

                <div className={s.right}>
                    <div className={s.selects}>
                        <select
                            className={s.select}
                            aria-label="Month"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {MONTHS.map((name, index) => (
                                <option key={name} value={index}>{name}</option>
                            ))}
                        </select>

                        <select
                            className={s.select}
                            aria-label="Year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            {YEARS.map((number) => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>

                    <div className={s.tableHead}>
                        <span>Category</span>
                        <span>Sum</span>
                    </div>

                    <ul className={s.list}>
                        {categories.map((category, index) => (
                            <li
                                key={category.name}
                                className={index === active ? `${s.row} ${s.rowActive}` : s.row}
                                onMouseEnter={() => setActive(index)}
                                onMouseLeave={() => setActive(-1)}
                                onClick={() => toggle(index)}
                            >
                                <span className={s.color} style={{ background: category.color }} />
                                <span className={s.name}>{category.name}</span>
                                <span className={s.sum}>{money(category.sum)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className={s.totals}>
                        <p>Expenses: <span className={s.expenses}>{money(expenses)}</span></p>
                        <p>Income: <span className={s.income}>{money(income)}</span></p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Statistics;
