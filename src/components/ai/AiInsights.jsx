import { MdAutoAwesome } from "react-icons/md";
import s from "./AiInsights.module.css";
import { analyze } from "../../ai/engine";

function AiInsights({ transactions, year, month }) {
    const items = analyze(transactions, year, month);

    return (
        <section className={s.insights} aria-label="AI insights">
            <h3 className={s.title}>
                <MdAutoAwesome /> AI insights
            </h3>

            <div className={s.grid}>
                {items.map((item) => (
                    <article key={item.id} className={`${s.card} ${s[item.tone]}`}>
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default AiInsights;
