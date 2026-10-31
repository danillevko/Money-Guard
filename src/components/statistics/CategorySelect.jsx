import { useState } from "react";
import s from "./CategorySelect.module.css";
import { CATEGORIES } from "../categories";

function CategorySelect({ value, onChange }) {
    const [open, setOpen] = useState(false);

    function choose(name) {
        onChange(name);
        setOpen(false);
    }

    return (
        <div className={s.select}>
            <button type="button" className={s.head} onClick={() => setOpen(!open)}>
                <span className={value ? s.value : s.placeholder}>
                    {value || "Select a category"}
                </span>
                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <ul className={s.list}>
                    {CATEGORIES.map((category) => (
                        <li
                            key={category.name}
                            className={category.name === value ? `${s.item} ${s.itemActive}` : s.item}
                            onClick={() => choose(category.name)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CategorySelect;