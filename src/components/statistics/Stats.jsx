import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import s from "./Stats.module.css";
import { CATEGORIES } from "../categories";

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
                sum = sum + Number(item.sum);
            }
        });
        return { ...category, sum: sum };
    });

    let expenses = 0;
    categories.forEach((category) => {
        expenses = expenses + category.sum;
    });

    let income = 0;
    monthTransactions.forEach((item) => {
        if (item.type === "Income") {
            income = income + Number(item.sum);
        }
    });

    const centerName = active >= 0 ? categories[active].name : "Total";
    const centerSum = active >= 0 ? categories[active].sum : expenses;

    return (
        <section className={s.statistics}>
            <h2 className={s.title}>Statistics</h2>

            <div className={s.content}>
                <div className={s.chartBox}>
                    <PieChart width={300} height={300}>
                        {expenses === 0 ? (
                            // empty gray ring when there are no expenses
                            <Pie
                                data={[{ value: 1 }]}
                                dataKey="value"
                                innerRadius={95}
                                outerRadius={130}
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
                                innerRadius={95}
                                outerRadius={130}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={2}
                                stroke="none"
                                onMouseEnter={(data, index) => setActive(index)}
                                onMouseLeave={() => setActive(-1)}
                            >
                                {categories.map((category) => (
                                    <Cell key={category.name} fill={category.color} />
                                ))}
                            </Pie>
                        )}
                    </PieChart>

                    <p className={s.chartTotal}>
                        {centerName}
                        <span>$ {money(centerSum)}</span>
                    </p>
                </div>

                <div className={s.right}>
                    <div className={s.selects}>
                        <select className={s.select} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                            {MONTHS.map((name, index) => (
                                <option key={name} value={index}>{name}</option>
                            ))}
                        </select>

                        <select className={s.select} value={year} onChange={(e) => setYear(Number(e.target.value))}>
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