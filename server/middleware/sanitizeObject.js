/**
 * Strips MongoDB operators and dot keys from objects held in req.body
 * in order to prevent NoSQL injection attacks.
 *
 * @param obj
 * @returns {*|{[p: string]: *|{[p: string]: any}}}
 */
export default function sanitizeObject(obj) {
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (obj && typeof obj === "object") {
        return Object.fromEntries(Object.entries(obj)
            .filter(([k]) => !k.startsWith("$") && !k.includes("."))
            .map(([k, v]) => [k, sanitizeObject(v)]));
    }
    return obj;
}