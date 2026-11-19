import { CATEGORIES } from "../components/categories";
import { categorize } from "./categorize";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MONTHS = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
];

const pad = (n) => String(n).padStart(2, "0");

export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const money = (n) =>
    "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const monthLabel = (year, month) => {
    const name = MONTHS[new Date(year, month, 1).getMonth()];
    return `${name[0].toUpperCase()}${name.slice(1)} ${new Date(year, month, 1).getFullYear()}`;
};

function monthRange(year, month) {
    return {
        from: iso(new Date(year, month, 1)),
        to: iso(new Date(year, month + 1, 0)),
    };
}

const inRange = (t, from, to) => t.date >= from && t.date <= to;
const isExpense = (t) => t.type === "Expense";
const isIncome = (t) => t.type === "Income";
const total = (list) => list.reduce((sum, t) => sum + Number(t.sum), 0);

function byCategory(list) {
    const map = new Map();
    list.filter(isExpense).forEach((t) => {
        map.set(t.category, (map.get(t.category) || 0) + Number(t.sum));
    });
    return [...map.entries()]
        .map(([name, sum]) => ({ name, total: sum }))
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total);
}

const percent = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

/* ------------------------------------------------------------------ */
/* Period parsing: "last month", "october", "this week", "2025" ...   */
/* ------------------------------------------------------------------ */

export function parsePeriod(question, now = new Date()) {
    const text = question.toLowerCase();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();

    if (/\btoday\b/.test(text)) {
        const day = iso(now);
        return { from: day, to: day, label: "today" };
    }
    if (/\byesterday\b/.test(text)) {
        const day = iso(new Date(y, m, d - 1));
        return { from: day, to: day, label: "yesterday" };
    }
    if (/\blast week\b/.test(text)) {
        const dow = (now.getDay() + 6) % 7; // Monday = 0
        return {
            from: iso(new Date(y, m, d - dow - 7)),
            to: iso(new Date(y, m, d - dow - 1)),
            label: "last week",
        };
    }
    if (/\b(this week|past week)\b/.test(text)) {
        const dow = (now.getDay() + 6) % 7;
        return { from: iso(new Date(y, m, d - dow)), to: iso(now), label: "this week" };
    }
    if (/\blast month\b/.test(text)) {
        return { ...monthRange(y, m - 1), label: "last month" };
    }
    if (/\bthis month\b/.test(text)) {
        return { ...monthRange(y, m), label: "this month" };
    }
    if (/\blast year\b/.test(text)) {
        return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31`, label: String(y - 1) };
    }
    if (/\bthis year\b/.test(text)) {
        return { from: `${y}-01-01`, to: `${y}-12-31`, label: String(y) };
    }

    const tokens = text.split(/[^a-z0-9]+/).filter(Boolean);
    const yearMatch = text.match(/\b(20\d\d)\b/);
    const monthIndex = MONTHS.findIndex((name) =>
        tokens.some((token) => token === name || (token.length === 3 && name.startsWith(token)))
    );

    if (monthIndex >= 0) {
        const year = yearMatch ? Number(yearMatch[1]) : monthIndex <= m ? y : y - 1;
        return { ...monthRange(year, monthIndex), label: monthLabel(year, monthIndex) };
    }
    if (yearMatch) {
        const year = Number(yearMatch[1]);
        return { from: `${year}-01-01`, to: `${year}-12-31`, label: String(year) };
    }

    return null;
}

function detectCategory(text) {
    const lower = text.toLowerCase();
    const exact = CATEGORIES.find((c) => {
        const name = c.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${name}\\b`).test(lower);
    });
    if (exact) return exact.name;

    const guess = categorize(text);
    return guess ? guess.category : null;
}

/* ------------------------------------------------------------------ */
/* Insights (used on the Statistics page and by the chat)              */
/* ------------------------------------------------------------------ */

const TIPS = {
    products: "Shopping with a list and planning meals ahead usually trims grocery spending.",
    car: "Combine errands into fewer trips and compare fuel prices to cut car costs.",
    leisure: "Setting a weekly leisure budget keeps outings enjoyable without surprises.",
    entertainment: "Review your subscriptions; cancelling one you rarely use is an easy win.",
    "main expenses": "Fixed bills are worth reviewing once a year, since providers often offer better plans.",
    "self care": "Bundling or booking ahead can bring regular self-care costs down.",
    "other expenses": "Check what is hiding in 'Other'. Naming those expenses helps you control them.",
};

export function analyze(transactions, year, month, now = new Date()) {
    const cur = monthRange(year, month);
    const prev = monthRange(year, month - 1);

    const curList = transactions.filter((t) => inRange(t, cur.from, cur.to));
    const prevList = transactions.filter((t) => inRange(t, prev.from, prev.to));

    if (curList.length === 0) {
        return [{
            id: "empty",
            tone: "info",
            title: "No data yet",
            text: `Add transactions for ${monthLabel(year, month)} to unlock personalised insights.`,
        }];
    }

    const spent = total(curList.filter(isExpense));
    const earned = total(curList.filter(isIncome));
    const prevSpent = total(prevList.filter(isExpense));
    const expenseCount = curList.filter(isExpense).length;

    const isCurrent = now.getFullYear() === year && now.getMonth() === month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysElapsed = isCurrent ? now.getDate() : daysInMonth;

    const items = [];

    if (expenseCount > 0) {
        items.push({
            id: "summary",
            tone: "info",
            title: "Spending summary",
            text: `You spent ${money(spent)} across ${expenseCount} expense${expenseCount === 1 ? "" : "s"}, about ${money(spent / daysElapsed)} per day.`,
        });
    }

    if (earned > 0) {
        const rate = Math.round(((earned - spent) / earned) * 100);
        if (rate >= 20) {
            items.push({ id: "savings", tone: "good", title: "Healthy savings", text: `You kept ${rate}% of your income. That is above the common 20% target.` });
        } else if (rate >= 0) {
            items.push({ id: "savings", tone: "warn", title: "Thin margin", text: `You kept only ${rate}% of your income. Aim for around 20% if you can.` });
        } else {
            items.push({ id: "savings", tone: "bad", title: "Spending exceeds income", text: `You spent ${money(spent - earned)} more than you earned this month.` });
        }
    }

    const cats = byCategory(curList);
    if (cats.length > 0) {
        const top = cats[0];
        items.push({
            id: "top",
            tone: "info",
            title: `Top category: ${top.name}`,
            text: `${money(top.total)} is ${percent(top.total, spent)}% of your spending.`,
        });
    }

    if (prevSpent > 0 && spent > 0 && (!isCurrent || daysElapsed >= 10)) {
        const change = Math.round(((spent - prevSpent) / prevSpent) * 100);
        if (change > 10) {
            items.push({ id: "trend", tone: "warn", title: `Spending up ${change}%`, text: `Compared with ${monthLabel(year, month - 1)} (${money(prevSpent)}).` });
        } else if (change < -10) {
            items.push({ id: "trend", tone: "good", title: `Spending down ${Math.abs(change)}%`, text: `Nice work compared with ${monthLabel(year, month - 1)} (${money(prevSpent)}).` });
        } else {
            items.push({ id: "trend", tone: "info", title: "Steady spending", text: `About the same as ${monthLabel(year, month - 1)} (${money(prevSpent)}).` });
        }
    }

    const prevCats = new Map(byCategory(prevList).map((c) => [c.name, c.total]));
    const spike = cats
        .map((c) => ({ ...c, before: prevCats.get(c.name) || 0 }))
        .filter((c) => c.before > 0 && c.total > c.before * 1.5 && c.total - c.before >= 20)
        .sort((a, b) => b.total - b.before - (a.total - a.before))[0];
    if (spike) {
        items.push({
            id: "spike",
            tone: "warn",
            title: `${spike.name} jumped`,
            text: `${money(spike.total)} vs ${money(spike.before)} last month.`,
        });
    }

    if (isCurrent && daysElapsed < daysInMonth && spent > 0 && daysElapsed >= 3) {
        const projected = (spent / daysElapsed) * daysInMonth;
        const over = earned > 0 && projected > earned;
        items.push({
            id: "projection",
            tone: over ? "warn" : "info",
            title: "Month-end forecast",
            text: over
                ? `At this pace you will spend about ${money(projected)}, more than your income so far (${money(earned)}).`
                : `At this pace you will spend about ${money(projected)} by the end of the month.`,
        });
    }

    const biggest = curList.filter(isExpense).sort((a, b) => Number(b.sum) - Number(a.sum))[0];
    if (biggest && expenseCount > 1) {
        items.push({
            id: "biggest",
            tone: "info",
            title: "Biggest expense",
            text: `${money(biggest.sum)} on ${biggest.category}${biggest.comment ? ` (${biggest.comment})` : ""}, on ${biggest.date}.`,
        });
    }

    if (cats.length > 0) {
        const tip = TIPS[cats[0].name.toLowerCase()];
        if (tip) items.push({ id: "tip", tone: "tip", title: "Tip", text: tip });
    }

    return items;
}

/* ------------------------------------------------------------------ */
/* Chat assistant                                                      */
/* ------------------------------------------------------------------ */

const HELP = [
    "I can answer questions about your money. Try:",
    "• How much did I spend this month?",
    "• How much did I spend on Products in October?",
    "• What's my biggest expense?",
    "• Which category do I spend most on?",
    "• Compare this month to last month",
    "• Show my last 5 transactions",
    "• What's my balance? / Give me insights",
].join("\n");

function inPeriod(transactions, period) {
    return transactions.filter((t) => inRange(t, period.from, period.to));
}

function withDefault(transactions, period, now) {
    if (period) return { period, list: inPeriod(transactions, period) };
    const month = { ...monthRange(now.getFullYear(), now.getMonth()), label: "this month" };
    return { period: month, list: inPeriod(transactions, month) };
}

const line = (t) =>
    `• ${t.date} · ${t.category || t.type} · ${money(t.sum)}${t.comment ? ` — ${t.comment}` : ""}`;

export function answer(question, { transactions, balance, now = new Date() }) {
    const text = question.trim().toLowerCase();
    if (!text) return HELP;

    if (/^(hi|hello|hey|yo|hola)\b/.test(text) || /\b(help|what can you do)\b/.test(text)) {
        return HELP;
    }

    const requestedPeriod = parsePeriod(text, now);

    if (/\b(balance|how much (money )?do i have|how much is left)\b/.test(text)) {
        const month = withDefault(transactions, null, now).list;
        const net = total(month.filter(isIncome)) - total(month.filter(isExpense));
        return `Your balance is ${money(balance)}.\nThis month you are ${net >= 0 ? "up" : "down"} ${money(Math.abs(net))} (income minus expenses).`;
    }

    if (transactions.length === 0) {
        return "You don't have any transactions yet. Tap + on the Home page to add one, and then I can analyse it for you.";
    }

    if (/\b(insight|insights|analy[sz]e|analysis|summary|overview|tips?|advice|how am i doing|saving)\b/.test(text)) {
        const ref = requestedPeriod ? new Date(requestedPeriod.from + "T00:00:00") : now;
        const items = analyze(transactions, ref.getFullYear(), ref.getMonth(), now);
        return `Here is what I see for ${monthLabel(ref.getFullYear(), ref.getMonth())}:\n` +
            items.map((i) => `• ${i.title}: ${i.text}`).join("\n");
    }

    if (/\b(compare|versus|vs)\b|than last month/.test(text)) {
        const thisMonth = monthRange(now.getFullYear(), now.getMonth());
        const lastMonth = monthRange(now.getFullYear(), now.getMonth() - 1);
        const a = total(inPeriod(transactions, thisMonth).filter(isExpense));
        const b = total(inPeriod(transactions, lastMonth).filter(isExpense));
        if (a === 0 && b === 0) return "I don't see any expenses in this month or last month to compare.";
        if (b === 0) return `You have spent ${money(a)} this month and nothing was recorded last month.`;
        const diff = a - b;
        const pct = Math.round((Math.abs(diff) / b) * 100);
        return `This month: ${money(a)}\nLast month: ${money(b)}\nThat is ${money(Math.abs(diff))} (${pct}%) ${diff > 0 ? "more" : "less"} than last month.`;
    }

    if (/\b(biggest|largest|highest|most expensive)\b/.test(text)) {
        let { period, list } = withDefault(transactions, requestedPeriod, now);
        let expenses = list.filter(isExpense);
        if (expenses.length === 0 && !requestedPeriod) {
            expenses = transactions.filter(isExpense);
            period = { label: "all time" };
        }
        if (expenses.length === 0) return `I don't see any expenses for ${period.label}.`;
        const top = [...expenses].sort((a, b) => Number(b.sum) - Number(a.sum))[0];
        return `Your biggest expense (${period.label}) was ${money(top.sum)} on ${top.category}${top.comment ? ` (${top.comment})` : ""}, on ${top.date}.`;
    }

    if (/(which|what) category|top categor|where .*(money|spend)|most .*(spend|money)|spend .*most/.test(text)) {
        let { period, list } = withDefault(transactions, requestedPeriod, now);
        let cats = byCategory(list);
        if (cats.length === 0 && !requestedPeriod) {
            cats = byCategory(transactions);
            period = { label: "all time" };
        }
        if (cats.length === 0) return `I don't see any expenses for ${period.label}.`;
        const all = cats.reduce((s, c) => s + c.total, 0);
        return `Where your money went (${period.label}):\n` +
            cats.slice(0, 4).map((c, i) => `${i + 1}. ${c.name}: ${money(c.total)} (${percent(c.total, all)}%)`).join("\n");
    }

    const recent = text.match(/\b(last|recent|latest)\s*(\d+)?\s*(transactions?|expenses?|purchases?|payments?)/);
    if (recent) {
        const count = Math.min(Number(recent[2]) || 5, 15);
        const sorted = [...transactions].sort((a, b) =>
            a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1
        );
        return `Your last ${Math.min(count, sorted.length)} transactions:\n` + sorted.slice(0, count).map(line).join("\n");
    }

    if (/how many/.test(text)) {
        const { period, list } = withDefault(transactions, requestedPeriod, now);
        const exp = list.filter(isExpense).length;
        const inc = list.filter(isIncome).length;
        return `For ${period.label} you have ${list.length} transaction${list.length === 1 ? "" : "s"}: ${exp} expense${exp === 1 ? "" : "s"} and ${inc} income.`;
    }

    if (/\b(average|avg|per day|daily)\b/.test(text)) {
        const { period, list } = withDefault(transactions, requestedPeriod, now);
        const expenses = list.filter(isExpense);
        if (expenses.length === 0) return `I don't see any expenses for ${period.label}.`;
        const start = new Date(period.from + "T00:00:00");
        const end = new Date(Math.min(new Date(period.to + "T00:00:00"), now));
        const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
        const spent = total(expenses);
        return `For ${period.label} you spent ${money(spent)}:\n• ${money(spent / days)} per day\n• ${money(spent / expenses.length)} per expense`;
    }

    if (/\b(income|earn|earned|received|salary|made)\b/.test(text)) {
        const { period, list } = withDefault(transactions, requestedPeriod, now);
        const earned = total(list.filter(isIncome));
        return earned > 0
            ? `Your income for ${period.label} is ${money(earned)}.`
            : `I don't see any income for ${period.label}.`;
    }

    const category = detectCategory(text);
    if (category || /\b(spen[dt]|cost|paid|pay|expenses?|bought|buy)\b/.test(text)) {
        const { period, list } = withDefault(transactions, requestedPeriod, now);
        const expenses = list.filter(isExpense);
        const scoped = category ? expenses.filter((t) => t.category === category) : expenses;
        const sum = total(scoped);

        if (scoped.length === 0) {
            return category
                ? `I don't see any ${category} spending for ${period.label}.`
                : `I don't see any expenses for ${period.label}.`;
        }

        let reply = `You spent ${money(sum)}${category ? ` on ${category}` : ""} (${period.label}) across ${scoped.length} transaction${scoped.length === 1 ? "" : "s"}.`;
        if (category) {
            reply += ` That is ${percent(sum, total(expenses))}% of your spending.`;
        }
        return reply;
    }

    return `I'm not sure I understood that.\n\n${HELP}`;
}
