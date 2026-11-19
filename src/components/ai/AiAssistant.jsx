import { useState, useRef, useEffect } from "react";
import { MdAutoAwesome, MdSend } from "react-icons/md";
import s from "./AiAssistant.module.css";
import { answer } from "../../ai/engine";

const SUGGESTIONS = [
    "How much did I spend this month?",
    "What's my biggest expense?",
    "Which category do I spend most on?",
    "Compare this month to last month",
    "Show my last 5 transactions",
    "Give me insights",
];

const GREETING =
    "Hi! I'm your Money Guard assistant. Ask me about your spending, income or balance, or tap one of the suggestions below.";

function AiAssistant({ transactions, balance }) {
    const [messages, setMessages] = useState([{ id: 0, role: "ai", text: GREETING }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const idRef = useRef(1);
    const timerRef = useRef(null);
    const listRef = useRef(null);

    // keep the newest message in view (scrolls only the chat, not the page)
    useEffect(() => {
        const list = listRef.current;
        if (list) {
            list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
        }
    }, [messages, typing]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    function send(text) {
        const question = text.trim();
        if (!question || typing) return;

        setMessages((list) => [...list, { id: idRef.current++, role: "user", text: question }]);
        setInput("");
        setTyping(true);

        timerRef.current = setTimeout(() => {
            const reply = answer(question, { transactions, balance });
            setMessages((list) => [...list, { id: idRef.current++, role: "ai", text: reply }]);
            setTyping(false);
        }, 450);
    }

    function handleSubmit(e) {
        e.preventDefault();
        send(input);
    }

    return (
        <section className={s.wrap} aria-label="AI assistant">
            <header className={s.header}>
                <span className={s.avatar}><MdAutoAwesome /></span>
                <div>
                    <h2>AI Assistant</h2>
                    <p>Runs privately in your browser</p>
                </div>
            </header>

            <div className={s.messages} ref={listRef} aria-live="polite">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={message.role === "user" ? `${s.bubble} ${s.user}` : `${s.bubble} ${s.ai}`}
                    >
                        {message.text}
                    </div>
                ))}

                {typing && (
                    <div className={`${s.bubble} ${s.ai} ${s.typing}`} aria-label="Assistant is typing">
                        <span /><span /><span />
                    </div>
                )}
            </div>

            <div className={s.chips}>
                {SUGGESTIONS.map((text) => (
                    <button key={text} type="button" onClick={() => send(text)} disabled={typing}>
                        {text}
                    </button>
                ))}
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your money…"
                    enterKeyHint="send"
                    autoComplete="off"
                    aria-label="Your question"
                />
                <button type="submit" disabled={!input.trim() || typing} aria-label="Send">
                    <MdSend />
                </button>
            </form>
        </section>
    );
}

export default AiAssistant;
