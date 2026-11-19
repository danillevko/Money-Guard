import { MdAutoAwesome } from "react-icons/md";
import s from "./CategorySuggestion.module.css";
import { categorize } from "../../ai/categorize";

/** Shows "AI suggests <category>" while the user types an expense comment. */
function CategorySuggestion({ comment, type, category, onApply }) {
    if (type !== "Expense") return null;

    const suggestion = categorize(comment);
    if (!suggestion || suggestion.category === category) return null;

    return (
        <button
            type="button"
            className={s.chip}
            onClick={() => onApply(suggestion.category)}
        >
            <MdAutoAwesome />
            <span>
                AI suggests <strong>{suggestion.category}</strong>
                <em> (“{suggestion.reason}”)</em>
            </span>
            <b>Apply</b>
        </button>
    );
}

export default CategorySuggestion;
