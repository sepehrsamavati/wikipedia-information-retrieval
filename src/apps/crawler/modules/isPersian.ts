import { franc } from "franc-min";

export default function isPersian(text: string) {
    const language = franc(text);
    return language === "pes";
}