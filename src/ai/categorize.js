import { CATEGORIES } from "../components/categories";

/**
 * Local "AI" auto-categorizer: scores a free-text comment against keyword groups
 * and maps the best group to one of the app's real categories.
 * Each group lists candidate category names, so it adapts to whatever is in CATEGORIES.
 */
const RULES = [
    {
        names: ["Products", "Food", "Groceries"],
        words: [
            "grocery", "groceries", "supermarket", "market", "walmart", "costco", "aldi", "kroger",
            "safeway", "lidl", "target", "trader joe", "whole foods", "bread", "milk", "eggs", "meat",
            "fruit", "vegetable", "snack", "food", "uber eats", "doordash", "grubhub", "bakery", "cheese",
        ],
    },
    {
        names: ["Car", "Transport", "Transportation"],
        words: [
            "gas", "gasoline", "fuel", "petrol", "uber", "lyft", "taxi", "cab", "parking", "car wash",
            "oil change", "tire", "toll", "bus", "metro", "subway", "train", "ticket", "mechanic",
            "repair", "car insurance", "airport", "diesel", "charging",
        ],
    },
    {
        names: ["Main expenses", "Main", "Bills"],
        words: [
            "rent", "mortgage", "electricity", "electric", "water bill", "internet", "wifi", "utilities",
            "utility", "phone bill", "insurance", "loan", "tax", "taxes", "heating", "subscription fee",
        ],
    },
    {
        names: ["Self care", "Health", "Personal"],
        words: [
            "haircut", "salon", "barber", "spa", "gym", "massage", "cosmetic", "cosmetics", "makeup",
            "perfume", "shampoo", "manicure", "doctor", "dentist", "pharmacy", "medicine", "vitamin",
            "skincare", "therapy", "yoga",
        ],
    },
    {
        names: ["Child care", "Children", "Kids"],
        words: ["baby", "diaper", "diapers", "kid", "kids", "child", "children", "toy", "toys", "nanny", "daycare", "stroller", "formula"],
    },
    {
        names: ["Household products", "Household", "Home"],
        words: [
            "soap", "detergent", "cleaning", "furniture", "ikea", "lamp", "towel", "bulb", "sponge",
            "trash bags", "toilet paper", "dishwasher", "curtain", "pillow", "blanket", "hardware", "tools",
        ],
    },
    {
        names: ["Education", "Study"],
        words: [
            "course", "tuition", "book", "books", "udemy", "coursera", "school", "university", "college",
            "class", "lesson", "exam", "textbook", "tutor", "workshop", "notebook",
        ],
    },
    {
        names: ["Entertainment", "Fun"],
        words: [
            "netflix", "spotify", "movie", "cinema", "game", "games", "steam", "playstation", "xbox",
            "concert", "theater", "theatre", "youtube", "hulu", "disney", "party", "club", "karaoke",
        ],
    },
    {
        names: ["Leisure", "Hobby"],
        words: [
            "restaurant", "cafe", "coffee", "pizza", "burger", "sushi", "bar", "pub", "lunch", "dinner",
            "brunch", "travel", "hotel", "vacation", "trip", "flight", "holiday", "beach", "museum", "hobby",
        ],
    },
    {
        names: ["Other expenses", "Other"],
        words: ["gift", "gifts", "donation", "charity", "fee", "fine", "present", "tip"],
    },
];

function resolveCategory(names) {
    for (const wanted of names) {
        const hit = CATEGORIES.find((c) => c.name.toLowerCase() === wanted.toLowerCase());
        if (hit) return hit.name;
    }
    for (const wanted of names) {
        const hit = CATEGORIES.find((c) => c.name.toLowerCase().includes(wanted.toLowerCase()));
        if (hit) return hit.name;
    }
    return null;
}

// Short words must match a whole token ("rent" must not match "current")
function matches(word, clean, tokens) {
    if (word.length <= 4) {
        return tokens.has(word) || tokens.has(word + "s");
    }
    return clean.includes(word);
}

/**
 * @param {string} text free-text comment, e.g. "Uber to airport"
 * @returns {{category: string, reason: string} | null}
 */
export function categorize(text) {
    const clean = (text || "").toLowerCase().trim();
    if (clean.length < 3) return null;

    const tokens = new Set(clean.split(/[^\p{L}\p{N}]+/u).filter(Boolean));

    const scored = RULES
        .map((rule) => ({
            rule,
            hits: rule.words.filter((word) => matches(word, clean, tokens)),
        }))
        .filter((entry) => entry.hits.length > 0)
        .sort((a, b) => b.hits.length - a.hits.length); // stable: earlier rules win ties

    for (const { rule, hits } of scored) {
        const category = resolveCategory(rule.names);
        if (category) {
            return { category, reason: hits[0] };
        }
    }

    return null;
}
