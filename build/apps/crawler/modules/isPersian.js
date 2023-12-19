import { franc } from "franc-min";
export default function isPersian(text) {
    const language = franc(text);
    return language === "pes";
}
