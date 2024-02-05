import type { RequestHandler } from "express";
import { extractPersianWords } from "../../documentProcess/modules/base.js";
import { guessText } from "../../../infrastructure/mongo/repository/bigram.js";

export const suggestNextWord: RequestHandler = async (req, res, next) => {
    const query = extractPersianWords(req.query.q as string);
    const nextWords = await guessText([query.pop()]);
    res.json(nextWords?.map(w => w.end));
};
